import GithubButton from "./GithubButton";
import BehanceButton from "./BehanceButton";
import EmailButton from "./EmailButton";

function Social({ classname }) {
  return (
    <div className={`${classname && `social_location_${classname}`} social`}>
      <GithubButton classname="get-in-touch" />
      <BehanceButton classname="get-in-touch" />
      <EmailButton classname="get-in-touch" />
    </div>
  );
}

export default Social;
