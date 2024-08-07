// import loading
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const LoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#8b8b8b35" highlightColor="#f9fafb">
      <td>
        <Skeleton count={1} />
      </td>
      <td>
        <Skeleton count={1} />
      </td>
    </SkeletonTheme>
  );
};

export const SectionLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#8b8b8b35" highlightColor="#f9fafb">
      <div className="w-full">
        <Skeleton count={1} />
      </div>
    </SkeletonTheme>
  );
};
