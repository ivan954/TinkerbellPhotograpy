import { useEffect } from "react";

const SITE_NAME = "טינקרבל סטודיו";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | צילומי ילדים ומשפחות`;
  }, [title]);
};

export default usePageTitle;
