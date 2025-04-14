import { fetchData } from "~/lib/apiRequest";
import PermissionManager from "./_components/PermissionManager";

const PermissionPage = async () => {
  const permissionGroups = await fetchData("/permissions/groups");
  const permissions = await fetchData("/permissions");
  // console.log(permissions);

  return (
    <div>
      <PermissionManager
        permissionGroupsData={permissionGroups}
        permissionsData={permissions}
      />
    </div>
  );
};

export default PermissionPage;
