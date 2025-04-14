import { fetchData } from "~/lib/apiRequest";
import PermissionManager from "./_components/PermissionManager";
import { isPermissionArray, isPermissionGroupArray } from "./_components/types";

const PermissionPage = async () => {
  const permissionGroups = await fetchData("/permissions/groups");
  const permissions = await fetchData("/permissions");

  if (!isPermissionArray(permissions)) {
    return <div>Invalid permissions data</div>;
  }

  if (!isPermissionGroupArray(permissionGroups)) {
    return <div>Invalid permission groups data</div>;
  }

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
