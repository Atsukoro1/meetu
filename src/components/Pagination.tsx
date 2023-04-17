interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const pageButtons = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`btn btn-lg ${i === currentPage ? 'btn-active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }
    } else {
        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(currentPage + 2, totalPages);

        if (startPage > 1) {
            pageButtons.push(
                <button
                    key={1}
                    className="btn btn-lg"
                    onClick={() => onPageChange(1)}
                >
                    1
                </button>
            );

            if (startPage > 2) {
                pageButtons.push(
                    <button
                        key="..."
                        className="btn btn-lg btn-disabled"
                        disabled
                    >
                        ...
                    </button>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`btn btn-lg ${i === currentPage ? 'btn-active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageButtons.push(
                    <button
                        key="..."
                        className="btn btn-lg btn-disabled"
                        disabled
                    >
                        ...
                    </button>
                );
            }

            pageButtons.push(
                <button
                    key={totalPages}
                    className="btn btn-lg"
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
    }

    return (
        <div className="btn-group w-fit mx-auto">
            {pageButtons}
        </div>
    );
};

export default Pagination;