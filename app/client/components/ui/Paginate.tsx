import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";

// Type guard to check if an object has an 'id' property
function hasIdProperty(item: unknown): item is { id: unknown } {
  return typeof item === "object" && item !== null && "id" in item;
}

function PaginatedItems({
  itemsPerPage,
  items,
  setPaginatedItems,
  paginatedItems,
}: {
  itemsPerPage: number;
  items: unknown[];
  setPaginatedItems: (items: unknown[]) => void;
  paginatedItems: unknown[];
}) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    if (
      hasIdProperty(currentItems[0]) &&
      hasIdProperty(paginatedItems[0]) &&
      currentItems[0].id !== paginatedItems[0].id
    ) {
      setPaginatedItems(currentItems);
    } else if (!paginatedItems.length && currentItems.length) {
      setPaginatedItems(currentItems);
    }
  }, [itemOffset, items, setPaginatedItems, currentItems, paginatedItems]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
  };

  return (
    <ReactPaginate
      nextLabel="Next >"
      onPageChange={handlePageClick}
      className="flex w-full justify-center items-center gap-2 sm:gap-5 my-10 font-nunito text-rose-400"
      previousLinkClassName="flex border-2 py-2 sm:px-3 px-2 rounded-md border-rose-300 hover:border-rose-200 text-xs sm:text-base hover:text-rose-300"
      nextLinkClassName="flex border-2 py-2 sm:px-3 px-2 rounded-md border-rose-300 hover:border-rose-200 text-xs sm:text-base hover:text-rose-300"
      pageLinkClassName="hidden sm:flex border-2 py-2 sm:px-3 px-2 rounded-md border-rose-300 hover:border-rose-200 text-xs sm:text-base hover:text-rose-300"
      breakClassName="hidden sm:flex"
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="< Prev"
      breakLabel="..."
      activeClassName="bg-rose-400 text-white rounded-md border-white border-2 hover:bg-white hover:text-rose-300"
      renderOnZeroPageCount={null}
    />
  );
}

function Paginate({
  items,
  paginatedItems,
  setPaginatedItems,
  itemsPerPage,
}: {
  items: unknown[];
  paginatedItems: unknown[];
  setPaginatedItems: (items: unknown[]) => void;
  itemsPerPage: number;
}) {
  return (
    <PaginatedItems
      itemsPerPage={itemsPerPage}
      items={items}
      paginatedItems={paginatedItems}
      setPaginatedItems={setPaginatedItems}
    />
  );
}

export default Paginate;
