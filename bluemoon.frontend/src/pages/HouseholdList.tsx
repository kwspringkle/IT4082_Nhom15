// pages/HouseholdList.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ViewHouseholdMembersDialog from "@/components/dialogs/ViewHouseholdMembersDialog";

// Import local components and utilities
import { Household, HouseholdFormData } from "../types/household";
import * as householdApi from "../api/household";
import AddHouseholdDialog from "../components/dialogs/AddHouseholdDialog";
import HouseholdTable from "../components/HouseholdTable";

const HouseholdList = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openHouseholdId, setOpenHouseholdId] = useState<string | null>(null);

  // Fetch households on component mount
  useEffect(() => {
    const loadHouseholds = async () => {
      setIsLoading(true);
      try {
        const householdsData = await householdApi.fetchHouseholds();
        setHouseholds(householdsData);
      } catch (error: any) {
        console.error("Fetch households error:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh sách căn hộ",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHouseholds();
  }, []);

  // Filter households based on search term
  const filteredHouseholds = households.filter((household) => {
    const apartment = household.apartment || "";
    const head = household.head || "";
    const phone = household.phone || "";
    return (
      apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  // Handle adding new household
  const handleAddHousehold = async (householdData: HouseholdFormData) => {
    try {
      setIsLoading(true);
      const newHousehold = await householdApi.addHousehold(householdData);
      setHouseholds([...households, newHousehold]);
      toast({
        title: "Thành công",
        description: `Đã thêm căn hộ ${newHousehold.apartment || "Unknown"}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Add household error:", error);
      throw error; // Re-throw to let dialog handle the error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating household
  const handleUpdateHousehold = async (householdId: string, householdData: HouseholdFormData) => {
    try {
      setIsLoading(true);
      const updatedHousehold = await householdApi.updateHousehold(householdId, householdData);
      setHouseholds(
        households.map((h) => (h._id === householdId ? updatedHousehold : h))
      );
      toast({
        title: "Thành công",
        description: `Đã cập nhật căn hộ ${updatedHousehold.apartment || "Unknown"}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Update household error:", error);
      throw error; // Re-throw to let dialog handle the error
    } finally {
      setIsLoading(false);
    }
  };

// Handle deleting household — thực chất là cập nhật để reset thông tin ngoại trừ apartment, floor, area
const handleDeleteHousehold = async (householdId: string) => {
  try {
    setIsLoading(true);

    // Gọi API PUT /delete/:id để reset thông tin
    await householdApi.resetHouseholdInfo(householdId);

    // Cập nhật lại state: load lại hoặc update thủ công
    setHouseholds(households.map(h =>
      h._id === householdId
        ? { ...h, head: "", phone: "", members: 0 }
        : h
    ));

    toast({
      title: "Thành công",
      description: "Đã đặt lại thông tin căn hộ (giữ lại apartment, floor, area)",
      variant: "default",
    });
  } catch (error: any) {
    console.error("Reset household info error:", error);
    toast({
      title: "Lỗi",
      description: error.message || "Không thể đặt lại thông tin căn hộ",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};



  // Handle viewing household members
  const handleViewMembers = (householdId: string) => {
    console.log(`Opening ViewHouseholdMembersDialog for householdId: ${householdId}`);
    setOpenHouseholdId(householdId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý căn hộ</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin căn hộ trong chung cư BlueMoon
          </p>
        </div>
        <AddHouseholdDialog onAddHousehold={handleAddHousehold}>
          <Button className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm căn hộ mới
          </Button>
        </AddHouseholdDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách căn hộ</CardTitle>
          <CardDescription>Tổng số căn hộ: {households.length}</CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo căn hộ, chủ hộ, số điện thoại..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">Đang tải...</div>
          ) : (
            <>
              <HouseholdTable
                households={filteredHouseholds}
                isLoading={isLoading}
                onViewMembers={handleViewMembers}
                onUpdateHousehold={handleUpdateHousehold}
                onDeleteHousehold={handleDeleteHousehold}
              />
              {openHouseholdId && (
                <ViewHouseholdMembersDialog
                  key={`view-dialog-${openHouseholdId}`}
                  householdId={openHouseholdId}
                  apartmentNumber={
                    households.find((h) => h._id === openHouseholdId)?.apartment || "Unknown"
                  }
                  open={!!openHouseholdId}
                  onOpenChange={(open) => {
                    if (!open) setOpenHouseholdId(null);
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdList;