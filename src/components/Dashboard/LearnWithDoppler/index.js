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
            numberOfItems={learnWithDopplerPosts.length}
          >
            {({ activeSlide, handleStop }) =>
              learnWithDopplerPosts.map((post, index) => (
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

export const learnWithDopplerPosts = [
  {
    id: `1`,
    title: `dashboard.learn_with_doppler_posts.post_1.title`,
    description: `dashboard.learn_with_doppler_posts.post_1.description`,
    link: `dashboard.learn_with_doppler_posts.post_1.link`,
    linkDescription: `dashboard.learn_with_doppler_posts.post_1.link_description`,
    trackingId: `dashboard-learnWithDoppler-card1`,
  },
  {
    id: `2`,
    title: `dashboard.learn_with_doppler_posts.post_2.title`,
    description: `dashboard.learn_with_doppler_posts.post_2.description`,
    link: `dashboard.learn_with_doppler_posts.post_2.link`,
    linkDescription: `dashboard.learn_with_doppler_posts.post_2.link_description`,
    trackingId: `dashboard-learnWithDoppler-card3`,
  },
  {
    id: `1`,
    title: `dashboard.learn_with_doppler_posts.post_3.title`,
    description: `dashboard.learn_with_doppler_posts.post_3.description`,
    link: `dashboard.learn_with_doppler_posts.post_3.link`,
    linkDescription: `dashboard.learn_with_doppler_posts.post_3.link_description`,
    trackingId: `dashboard-learnWithDoppler-card2`,
  },
  {
    id: `4`,
    title: `dashboard.learn_with_doppler_posts.post_4.title`,
    description: `dashboard.learn_with_doppler_posts.post_4.description`,
    link: `dashboard.learn_with_doppler_posts.post_4.link`,
    linkDescription: `dashboard.learn_with_doppler_posts.post_4.link_description`,
    trackingId: `dashboard-learnWithDoppler-card4`,
  },
];
