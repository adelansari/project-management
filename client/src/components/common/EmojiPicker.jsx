import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

import "emoji-mart";
import { Picker } from "emoji-mart";

const EmojiPicker = (props) => {
    // Set up state to manage selected emoji and picker visibility
    const [selectedEmoji, setSelectedEmoji] = useState();
    const [isShowPicker, setIsShowPicker] = useState(false);

    // Update selectedEmoji when props.icon changes
    useEffect(() => {
        setSelectedEmoji(props.icon);
    }, [props.icon]);

    // Handler for selecting an emoji from the picker
    const selectEmoji = (e) => {
        const sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        const emoji = String.fromCodePoint(...codesArray);
        setIsShowPicker(false);
        props.onChange(emoji);
    };

    // Handler for toggling picker visibility
    const showPicker = () => setIsShowPicker(!isShowPicker);

    return (
        <Box sx={{ position: "relative", width: "max-content" }}>
            {/* Display currently selected emoji and make it clickable */}
            <Typography variant="h3" fontWeight="700" sx={{ cursor: "pointer" }} onClick={showPicker}>
                {selectedEmoji}
            </Typography>
            {/* Show the emoji picker if isShowPicker is true */}
            <Box
                sx={{
                    display: isShowPicker ? "block" : "none",
                    position: "absolute",
                    top: "100%",
                    zIndex: "9999",
                }}
            >
                <Picker theme="dark" onSelect={selectEmoji} showPreview={false} />
            </Box>
        </Box>
    );
};

export default EmojiPicker;
