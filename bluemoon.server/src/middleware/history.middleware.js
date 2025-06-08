import History from '../model/History.js';
import mongoose from 'mongoose';

export function attachHistoryLogging(schema, collectionName) {
  schema.pre('findOneAndUpdate', async function (next) {
    try {
      const original = await this.model.findOne(this.getQuery());
      this._original = original?.toObject();
      next();
    } catch (err) {
      next(err);
    }
  });

  schema.post('findOneAndUpdate', async function (result) {
    const original = this._original;
    const updated = result?.toObject();
    const userId = this.getOptions().context?.userId || 'unknown';

    if (!original || !updated) return;

    const changes = {};

    for (const key in updated) {
      if (
        key === '_id' ||
        key === 'updatedAt' ||
        key === 'createdAt' ||
        typeof updated[key] === 'function'
      ) continue;

      const originalValue = normalizeValue(original[key]);
      const updatedValue = normalizeValue(updated[key]);

      if (!deepEqual(originalValue, updatedValue)) {
        changes[key] = { from: original[key], to: updated[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await History.create({
        collectionName,
        documentId: updated._id,
        operation: 'update',
        modifiedBy: userId,
        changes
      });
    }
  });
}

// Helper: Normalize values for comparison
function normalizeValue(value) {
  if (value instanceof mongoose.Types.ObjectId) {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value === undefined) return null;
  return value;
}

// Helper: Deep compare values (shallow for your use-case)
function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
