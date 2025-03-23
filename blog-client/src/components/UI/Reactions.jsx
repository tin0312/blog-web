import React, { useState, useEffect } from "react";

export default function Reactions() {
    const [isReactionEmotions, setIsReactionEmotions] = useState(false);
    const [reactionEmotions, setReactionEmotions] = useState({
        love: 0,
        agree: 0,
        mindBlown: 0,
        onFire: 0,
    })

    useEffect(() => {
        async function handleSaveReactionEmotions() {
            try {
                await fetch("/apit/post/add-reaction", {
                    method: "POST",
                    body: JSON.stringify(reactionEmotions),
                })
            } catch (error) {
                console.log("Error saving reaction emotions")
            }
        }
        handleSaveReactionEmotions()
    }, [reactionEmotions])

    function hanldeReactionClick(emotion) {
        setReactionEmotions(prev => ({
            ...prev,
            [emotion]: prev[emotion] + 1
        }))
    }

    return (
        <>
            <div className="interaction-buttons d-flex flex-column gap-5 position-relative">
                <span class="material-symbols-outlined" onClick={() => setIsReactionEmotions(prevState => !prevState)}>
                    add_reaction
                </span>  <span class="material-symbols-outlined">
                    comment
                </span>
                <span class="material-symbols-outlined">
                    bookmark
                </span>
                <div className={`${isReactionEmotions ? "d-block" : "d-none"} reaction-emotions-container position-absolute bg-white p-3 d-flex`}>
                    <img onClick={() => hanldeReactionClick("love")} width="38" height="38" src="https://img.icons8.com/color/38/filled-like.png" alt="filled-like" />
                    <img onClick={() => hanldeReactionClick("agree")} width="38" height="38" src="https://img.icons8.com/color/38/high-five--v1.png" alt="high-five--v1" />
                    <img onClick={() => hanldeReactionClick("mindBlown")} width="38" height="38" src="https://img.icons8.com/3d-fluency/94/exploding-head.png" alt="exploding-head" />
                    <img onClick={() => hanldeReactionClick("onFire")} width="38" height="38" src="https://img.icons8.com/emoji/38/fire.png" alt="fire" />
                </div>

            </div>
        </>
    )
}
