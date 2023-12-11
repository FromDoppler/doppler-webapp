import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

export const Pagination = ({ currentPage, pagesCount, urlToGo }) => {
  const showedPages = 5;
  const stepPages = 4;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const getPageListSincePage = (sincePage) =>
    [...Array(pagesCount > showedPages ? showedPages : pagesCount)].map(
      (_, index) => Number(sincePage) + index,
    );

  const [currentPageList, setCurrentPageList] = useState(
    getPageListSincePage(
      Number(currentPage) >= 1 && Number(currentPage) + showedPages <= pagesCount
        ? Number(currentPage)
        : Number(currentPage) < 1 || pagesCount <= showedPages
          ? 1
          : pagesCount - showedPages + 1,
    ),
  );

  const ArrowPreviousPage = ({ currentPage, urlToGo }) =>
    Number(currentPage) !== 1 ? (
      <li>
        <Link
          className="ms-icon icon-arrow-prev"
          to={`${urlToGo}page=${Number(currentPage) - 1}`}
        ></Link>
      </li>
    ) : (
      <></>
    );

  const ArrowNextPage = ({ pagesCount, currentPage, urlToGo }) =>
    Number(pagesCount) !== Number(currentPage) ? (
      <li>
        <Link
          className="ms-icon icon-arrow-next"
          to={`${urlToGo}page=${Number(currentPage) + 1}`}
        ></Link>
      </li>
    ) : (
      <></>
    );

  const SlideToLeft = ({ currentPageList, currentPage, urlToGo, stepPages }) =>
    currentPageList[0] > 1 ? (
      <>
        <li>
          <Link
            className={1 === Number(currentPage) ? 'dp-active-page' : ''}
            to={`${urlToGo}page=1`}
          >
            1
          </Link>
        </li>
        <li>
          <button
            id="pag-point-left"
            className="dp-pag-point"
            title={_('pagination.go_back_pages')}
            onClick={() =>
              setCurrentPageList(
                getPageListSincePage(
                  currentPageList[0] - stepPages > 1 ? currentPageList[0] - stepPages : 1,
                ),
              )
            }
          ></button>
        </li>
      </>
    ) : (
      <></>
    );

  const SlideToRight = ({ currentPageList, pagesCount, showedPages, stepPages, urlToGo }) =>
    currentPageList[currentPageList.length - 1] < Number(pagesCount) ? (
      <>
        <li>
          <button
            id="pag-point-right"
            className="dp-pag-point"
            title={_('pagination.go_foward_pages')}
            onClick={() =>
              setCurrentPageList(
                getPageListSincePage(
                  currentPageList[showedPages - 1] + stepPages <= pagesCount
                    ? currentPageList[0] + stepPages
                    : pagesCount - showedPages + 1,
                ),
              )
            }
          ></button>
        </li>
        <li>
          <Link
            className={pagesCount === Number(currentPage) ? 'dp-active-page' : ''}
            to={`${urlToGo}page=${pagesCount}`}
          >
            {pagesCount}
          </Link>
        </li>
      </>
    ) : (
      <></>
    );

  const CurrentPageList = ({ currentPageList, urlToGo, currentPage }) =>
    currentPageList.map((number) => (
      <li key={number}>
        {number === Number(currentPage) ? (
          <span className="dp-active-page" aria-current="page">
            {number}
          </span>
        ) : (
          <Link to={`${urlToGo}page=${number}`}>{number}</Link>
        )}
      </li>
    ));

  return pagesCount > 0 ? (
    <nav className="dp-pagination">
      <ul>
        <ArrowPreviousPage currentPage={currentPage} urlToGo={urlToGo} />
        <SlideToLeft
          currentPageList={currentPageList}
          currentPage={currentPage}
          urlToGo={urlToGo}
          stepPages={stepPages}
        />
        <CurrentPageList
          currentPageList={currentPageList}
          urlToGo={urlToGo}
          currentPage={currentPage}
        />
        <SlideToRight
          currentPageList={currentPageList}
          pagesCount={pagesCount}
          showedPages={showedPages}
          stepPages={stepPages}
          urlToGo={urlToGo}
        />
        <ArrowNextPage pagesCount={pagesCount} currentPage={currentPage} urlToGo={urlToGo} />
      </ul>
    </nav>
  ) : (
    <></>
  );
};
