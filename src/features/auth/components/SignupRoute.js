import NotFound from "../../../app/components/NotFound";
import { useSiteSettingsQuery } from "../../../shared/queries/siteSettingsQueries";
import SignUp from "./SignUp";

function SignupRoute(props) {
  const {
    data: siteSettings,
    isError,
    isFetching,
    isLoading,
  } = useSiteSettingsQuery({
    refetchOnMount: "always",
    staleTime: 0,
  });

  if (isLoading || isFetching) {
    return null;
  }

  if (isError || siteSettings?.auth?.signupEnabled !== true) {
    return <NotFound />;
  }

  return <SignUp {...props} />;
}

export default SignupRoute;
