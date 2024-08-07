import React from "react";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button onClick={onPrev} disabled={!hasPrevPage}>
        Previous
      </Button>
      <p>
        Page {currentPage} of {totalPages}
      </p>
      <Button onClick={onNext} disabled={!hasNextPage}>
        Next
      </Button>
    </div>
  );
};

export default Pagination;
