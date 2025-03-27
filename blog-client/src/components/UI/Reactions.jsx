import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/AuthProvider";

export default function Reactions({ postId, authorId, loveCount, agreeCount, mindBlownCount, onFireCount, totalReactionCount }) {
    const { user } = useAuth();
    const [isReactionEmotions, setIsReactionEmotions] = useState(false);
    const [reactionEmotions, setReactionEmotions] = useState({
        postId: parseInt(postId),
        currentUserId: user?.userId,
        authorId,
        love: loveCount || 0,
        agree: agreeCount || 0,
        mindBlown: mindBlownCount || 0,
        onFire: onFireCount || 0,
        totalReactionCount: totalReactionCount || 0
    });
    const [emotionStates, setEmotionStates] = useState({
        love: false,
        agree: false,
        mindBlown: false,
        onFire: false
    })
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
        setEmotionStates((prev) => {
            const isAdding = !prev[emotion]
            setReactionEmotions((prev) => {
                const updatedReactEmotions = {
                    ...prev,
                    [emotion]: prev[emotion] + (isAdding ? 1 : -1),
                    totalReactionCount: prev.totalReactionCount + (isAdding ? 1 : -1)
                };

                if (!hasSavedRef.current) {
                    handleSaveReactionEmotions(updatedReactEmotions);
                    hasSavedRef.current = true;
                }
                return updatedReactEmotions;
            });

            return { ...prev, [emotion]: isAdding }
        })
    }

    useEffect(() => {
        hasSavedRef.current = false;
    }, [reactionEmotions]);

    return (
        <>
            <div className="interaction-buttons d-flex flex-column gap-5 position-relative">
                <div className="text-center">
                    <span
                        title="Add reactions"
                        className="material-symbols-outlined"
                        onClick={() => {
                            setIsReactionEmotions((prevState) => !prevState)
                        }
                        }
                    >
                        add_reaction
                    </span>
                    <p className="text-secondary">{reactionEmotions.totalReactionCount}</p>
                </div>
                <div className="text-center">
                    <span className="material-symbols-outlined" title="Jump to comments">comment</span>
                    <p className="text-secondary">0</p>
                </div>
                <div className="text-center">
                    <span className="material-symbols-outlined" title="Save">bookmark</span>
                    <p className="text-secondary">0</p>
                </div>

                <div
                    className={`${isReactionEmotions ? "d-block" : "d-none"
                        } reaction-emotions-container position-absolute bg-white p-3 d-flex`}
                >
                    <div className={`text-center ${emotionStates["love"] ? "bg-secondary-subtle" : ""} `} >
                        <img
                            onClick={() => handleReactionClick("love")}
                            width="38"
                            height="38"
                            src="https://img.icons8.com/color/38/filled-like.png"
                            alt="filled-like"
                        />
                        <p className="text-secondary">{reactionEmotions.love}</p>
                    </div>
                    <div className={`text-center ${emotionStates["agree"] ? "bg-secondary-subtle" : ""} `}>
                        <img

                            onClick={() => handleReactionClick("agree")}
                            width="38"
                            height="38"
                            src="https://img.icons8.com/color/38/high-five--v1.png"
                            alt="high-five--v1"
                        />
                        <p className="text-secondary">{reactionEmotions.agree}</p>
                    </div>
                    <div className={`text-center ${emotionStates["mindBlown"] ? "bg-secondary-subtle" : ""} `}>
                        <img
                            onClick={() => handleReactionClick("mindBlown")}
                            width="38"
                            height="38"
                            src="https://img.icons8.com/3d-fluency/94/exploding-head.png"
                            alt="exploding-head"
                        />
                        <p className="text-secondary">{reactionEmotions.mindBlown}</p>
                    </div>
                    <div className={`text-center ${emotionStates["onFire"] ? "bg-secondary-subtle" : ""} `}>
                        <img

                            onClick={() => handleReactionClick("onFire")}
                            width="38"
                            height="38"
                            src="https://img.icons8.com/emoji/38/fire.png"
                            alt="fire"
                        />
                        <p className="text-secondary">{reactionEmotions.onFire}</p>
                    </div>

                </div>
            </div>
        </>
    );
}
