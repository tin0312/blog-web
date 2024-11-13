import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";

function PostReactions({ postId, likeCount, helpfulCount, brilliantCount }) {
  const { user } = useAuth();
  const [likeCtn, setLikeCtn] = useState();
  const [helpfulCtn, setHelpfulCtn] = useState();
  const [brilliantCtn, setBrilliantCtn] = useState();
  const [activeReaction, setActiveReaction] = useState({});

  useEffect(() => {
    setLikeCtn(likeCount);
    setHelpfulCtn(helpfulCount);
    setBrilliantCtn(brilliantCount);
  }, [likeCount, helpfulCount, brilliantCount]);

  function handleReactionCount(reactionType) {
    if (user) {
      setActiveReaction((prevActiveState) => {
        const newActiveReaction = {
          ...prevActiveState,
          [reactionType]: !prevActiveState[reactionType],
        };
        localStorage.setItem(
          `${user?.username}-Post ${postId}`,
          JSON.stringify(newActiveReaction)
        );
        return newActiveReaction;
      });

      let newLikeCount;
      let newHelpfulCount;
      let newBrilliantCount;

      if (reactionType === "like") {
        newLikeCount = activeReaction.like ? likeCtn - 1 : likeCtn + 1;
        setLikeCtn(newLikeCount);
      } else if (reactionType === "helpful") {
        newHelpfulCount = activeReaction.helpful
          ? helpfulCtn - 1
          : helpfulCtn + 1;
        setHelpfulCtn(newHelpfulCount);
      } else {
        newBrilliantCount = activeReaction.brilliant
          ? brilliantCtn - 1
          : brilliantCtn + 1;
        setBrilliantCtn(newBrilliantCount);
      }
      updateReaction(newLikeCount, newHelpfulCount, newBrilliantCount);
    }
  }

  async function updateReaction(likeCount, helpfulCount, brilliantCount) {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/add-reaction`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            likeCount,
            helpfulCount,
            brilliantCount,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      const savedActiveReaction = JSON.parse(
        localStorage.getItem(`${user?.username}-Post ${postId}`)
      );
      if (savedActiveReaction) {
        setActiveReaction(savedActiveReaction);
      } else {
        setActiveReaction({
          like: false,
          helpful: false,
          brilliant: false,
        });
      }
    }
  }, [user, postId]);

  return (
    <div>
      <ul className="reactions-container">
        <li
          style={activeReaction.like ? { color: "white" } : null}
          onClick={() => handleReactionCount("like")}
        >
          ({likeCtn}) Like
        </li>
        <li
          style={activeReaction.helpful ? { color: "white" } : null}
          onClick={() => handleReactionCount("helpful")}
        >
          ({helpfulCtn}) Helpful
        </li>
        <li
          style={activeReaction.brilliant ? { color: "white" } : null}
          onClick={() => handleReactionCount("brilliant")}
        >
          ({brilliantCtn}) Brilliant
        </li>
      </ul>
    </div>
  );
}

export default PostReactions;
