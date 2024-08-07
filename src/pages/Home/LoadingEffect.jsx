// import loading
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AnalyticsLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#8b8b8b35" highlightColor="#f9fafb">
      <span>
        <Skeleton count={1} />
      </span>
    </SkeletonTheme>
  );
};
