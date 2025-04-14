// page.tsx
import { fetchData } from "~/lib/apiRequest";
import PermissionManagement from "./_components/PremissionManagment";

const page = async () => {
  try {
    const [roles, permissionGroups, permissions] = await Promise.all([
      fetchData("/roles"),
      fetchData("/permissions/groups"),
      fetchData("/permissions"),
    ]);

    return (
      <div>
        <PermissionManagement
          permissionGroupsData={permissionGroups}
          permissionsData={permissions}
          rolesData={roles}
        />
      </div>
    );
  } catch (error) {
    return <p className="text-red-600">Failed to load data.</p>;
  }
};

export default page;
