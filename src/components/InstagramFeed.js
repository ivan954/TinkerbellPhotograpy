import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BsInstagram, BsPlayFill } from "react-icons/bs";
import Reveal from "./Reveal";
import { useContent } from "../content/ContentProvider";
import "./InstagramFeed.css";

const COUNT = 6;

// One request per visit, shared by the home and gallery pages.
const feeds = {};
const loadFeed = (url) => {
  if (!feeds[url]) {
    feeds[url] = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Instagram feed: ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        delete feeds[url];
        throw error;
      });
  }
  return feeds[url];
};

// Behold (behold.so) turns the Instagram account into a JSON feed: an object
// with a "posts" list (older feeds: the list itself). Each post links to
// Instagram and has resized copies under "sizes".
const toPosts = (data) =>
  (Array.isArray(data) ? data : data?.posts || [])
    .map((post) => ({
      id: post.id || post.permalink,
      link: post.permalink,
      image: post.sizes?.medium?.mediaUrl || post.sizes?.small?.mediaUrl || post.thumbnailUrl || post.mediaUrl,
      isVideo: post.mediaType === "VIDEO",
      caption: post.prunedCaption || post.caption || "",
    }))
    .filter((post) => post.link && post.image)
    .slice(0, COUNT);

// The latest Instagram photos. Hidden until a feed address is set in the
// admin screen, and if the feed can't be loaded.
const InstagramFeed = () => {
  const { instagramFeed } = useContent("common");
  const { social } = useContent("footer");
  const [posts, setPosts] = useState([]);
  const url = instagramFeed.visible ? String(instagramFeed.feedUrl || "").trim() : "";

  useEffect(() => {
    if (!url) return undefined;
    let current = true;
    loadFeed(url).then(
      (data) => current && setPosts(toPosts(data)),
      (error) => console.warn(error.message)
    );
    return () => {
      current = false;
    };
  }, [url]);

  if (!url || !posts.length) return null;

  return (
    <section className="section instagram-feed">
      <Container>
        <Reveal className="section-heading">
          <span className="section-eyebrow">{instagramFeed.eyebrow}</span>
          <h2>{instagramFeed.title}</h2>
        </Reveal>
        <div className="instagram-grid">
          {posts.map((post) => (
            <a
              key={post.id}
              className="instagram-post"
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.caption ? `פוסט באינסטגרם: ${post.caption.slice(0, 80)}` : "פוסט באינסטגרם"}
            >
              <img src={post.image} alt="" loading="lazy" decoding="async" />
              {post.isVideo && <BsPlayFill className="instagram-video" aria-hidden="true" />}
            </a>
          ))}
        </div>
        {social.instagram?.url && (
          <div className="instagram-more">
            <a className="btn-outline-brand" href={social.instagram.url} target="_blank" rel="noopener noreferrer">
              <BsInstagram /> {instagramFeed.button}
            </a>
          </div>
        )}
      </Container>
    </section>
  );
};

export default InstagramFeed;
