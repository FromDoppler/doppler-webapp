import React from 'react';
import { DashboardIconSubTitle } from '../Kpis/KpiGroup';
import { Carousel } from './Carousel/Carousel';
import { Slide } from './Carousel/Slide/Slide';
import { TextPreviewPost } from './TextPreviewPost/TextPreviewPost';

export const LearnWithDoppler = () => {
  return (
    <>
      <div className="dp-dashboard-title">
        <DashboardIconSubTitle
          title="dashboard.learn_with_doppler"
          iconClass="dp-learn-with-doppler"
        />
      </div>
      <div className="dp-rowflex">
        <div className="col-sm-12 col-md-12">
          <Carousel
            id="1"
            color="orange"
            ariaLabel="learn-with-doppler"
            numberOfItems={fakePostList.length}
          >
            {({ activeSlide, handleStop }) =>
              fakePostList.map((post, index) => (
                <Slide key={post.id} active={activeSlide === index}>
                  <TextPreviewPost post={post} handleStop={handleStop} />
                </Slide>
              ))
            }
          </Carousel>
        </div>
      </div>
    </>
  );
};

export const fakePostList = [
  {
    id: `1`,
    title: `dashboard.postListBlog_1_title`,
    description: `dashboard.postListBlog_1_description`,
    link: `dashboard.postListBlog_1_link`,
    linkDescription: `dashboard.postListBlog_1_link_description`,
    trackingId: `dashboard-learnWithDoppler-card1`,
  },
  {
    id: `2`,
    title: `dashboard.postListBlog_2_title`,
    description: `dashboard.postListBlog_2_description`,
    link: `dashboard.postListBlog_2_link`,
    linkDescription: `dashboard.postListBlog_2_link_description`,
    trackingId: `dashboard-learnWithDoppler-card2`,
  },
  {
    id: `3`,
    title: `dashboard.postListHelp_1_title`,
    description: `dashboard.postListHelp_1_description`,
    link: `dashboard.postListHelp_1_link`,
    linkDescription: `dashboard.postListHelp_1_link_description`,
    trackingId: `dashboard-learnWithDoppler-card3`,
  },
  {
    id: `4`,
    title: `dashboard.postListHelp_2_title`,
    description: `dashboard.postListHelp_2_description`,
    link: `dashboard.postListHelp_2_link`,
    linkDescription: `dashboard.postListHelp_2_link_description`,
    trackingId: `dashboard-learnWithDoppler-card4`,
  },
];
