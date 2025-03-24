import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/AuthProvider";

export default function Reactions({ postId, authorId }) {
    const { user } = useAuth();
    const [isReactionEmotions, setIsReactionEmotions] = useState(false);
    const [reactionEmotions, setReactionEmotions] = useState({
        postId: parseInt(postId),
        currentUserId: user?.userId,
        authorId,
        love: 0,
        agree: 0,
        mindBlown: 0,
        onFire: 0,
    });

    // Avoid react state batch updates to prevent unnecessary API calls
    const hasSavedRef = useRef(false);

    async function handleSaveReactionEmotions(updatedReactionEmotions) {
        try {
            await fetch("/api/posts/add-reaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedReactionEmotions),
            });
            console.log("Reaction saved successfully");
        } catch (error) {
            console.log("Error saving reaction emotions");
        }
    }

    function handleReactionClick(emotion) {
        setReactionEmotions((prev) => {
            const updatedReactEmotions = {
                ...prev,
                [emotion]: prev[emotion] + 1,
            };

            if (!hasSavedRef.current) {
                handleSaveReactionEmotions(updatedReactEmotions);
                hasSavedRef.current = true;
            }
            return updatedReactEmotions;
        });
    }

    useEffect(() => {
        hasSavedRef.current = false;
    }, [reactionEmotions]);

    return (
        <>
            <div className="interaction-buttons d-flex flex-column gap-5 position-relative">
                <span
                    className="material-symbols-outlined"
                    onClick={() => setIsReactionEmotions((prevState) => !prevState)}
                >
                    add_reaction
                </span>
                <span className="material-symbols-outlined">comment</span>
                <span className="material-symbols-outlined">bookmark</span>
                <div
                    className={`${isReactionEmotions ? "d-block" : "d-none"
                        } reaction-emotions-container position-absolute bg-white p-3 d-flex`}
                >
                    <img
                        onClick={() => handleReactionClick("love")}
                        width="38"
                        height="38"
                        src="https://img.icons8.com/color/38/filled-like.png"
                        alt="filled-like"
                    />
                    <img
                        onClick={() => handleReactionClick("agree")}
                        width="38"
                        height="38"
                        src="https://img.icons8.com/color/38/high-five--v1.png"
                        alt="high-five--v1"
                    />
                    <img
                        onClick={() => handleReactionClick("mindBlown")}
                        width="38"
                        height="38"
                        src="https://img.icons8.com/3d-fluency/94/exploding-head.png"
                        alt="exploding-head"
                    />
                    <img
                        onClick={() => handleReactionClick("onFire")}
                        width="38"
                        height="38"
                        src="https://img.icons8.com/emoji/38/fire.png"
                        alt="fire"
                    />
                </div>
            </div>
        </>
    );
}
