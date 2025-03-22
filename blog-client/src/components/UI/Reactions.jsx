import React, { useState } from "react";

export default function Reactions() {
    const [isReactionEmotions, setIsReactionEmotions] = useState(false);
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
                    <img width="38" height="38" src="https://img.icons8.com/color/38/filled-like.png" alt="filled-like" />
                    <img width="38" height="38" src="https://img.icons8.com/color/38/high-five--v1.png" alt="high-five--v1" />
                    <img width="38" height="38" src="https://img.icons8.com/3d-fluency/94/exploding-head.png" alt="exploding-head" />
                    <img width="38" height="38" src="https://img.icons8.com/emoji/38/fire.png" alt="fire" />
                </div>

            </div>
        </>
    )
}
