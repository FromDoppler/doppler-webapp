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
        <div className="col-sm-12 col-md-6">
          <Carousel id="1" color="orange" ariaLabel="blog">
            {({ activeSlide }) =>
              fakePostList.blog.map((post, index) => (
                <Slide key={post.id} active={activeSlide === index}>
                  <TextPreviewPost post={post} />
                </Slide>
              ))
            }
          </Carousel>
        </div>
        <div className="col-sm-12 col-md-6">
          <Carousel id="2" color="purple" ariaLabel="help">
            {({ activeSlide }) =>
              fakePostList.help.map((post, index) => (
                <Slide key={post.id} active={activeSlide === index}>
                  <TextPreviewPost post={post} />
                </Slide>
              ))
            }
          </Carousel>
        </div>
      </div>
    </>
  );
};

export const fakePostList = {
  blog: [
    {
      id: `1`,
      title: `dashboard.postListBlog_1_title`,
      description: `dashboard.postListBlog_1_description`,
      link: `dashboard.postListBlog_1_link`,
      linkDescription: `dashboard.postListBlog_1_link_description`,
    },
    {
      id: `2`,
      title: `dashboard.postListBlog_2_title`,
      description: `dashboard.postListBlog_2_description`,
      link: `dashboard.postListBlog_2_link`,
      linkDescription: `dashboard.postListBlog_2_link_description`,
    },
  ],
  help: [
    {
      id: `1`,
      title: `dashboard.postListHelp_1_title`,
      description: `dashboard.postListHelp_1_description`,
      link: `dashboard.postListHelp_1_link`,
      linkDescription: `dashboard.postListHelp_1_link_description`,
    },
    {
      id: `2`,
      title: `dashboard.postListHelp_2_title`,
      description: `dashboard.postListHelp_2_description`,
      link: `dashboard.postListHelp_2_link`,
      linkDescription: `dashboard.postListHelp_2_link_description`,
    },
  ],
};
