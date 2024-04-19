import { editor } from "monaco-editor";
import React from "react";
import store from "../../app/store";
import { rightNfoId } from "../../components/App";
import { setLastInput } from "../app/appSlice";
import {
    addSection,
    addSubsection,
    delSection,
    delSubsection,
    handleBorderChange,
    handleContentChange,
    handleInputChange,
    handleJsonChange,
    moveSection,
    moveSubsection,
    showConfirmLoadTemplate,
} from "./nfoSlice";


export const eHandleInputChange = (e: React.ChangeEvent<Element>) => {
    const target = e.target as HTMLInputElement;
    store.dispatch(handleInputChange({
        targetName: target.name,
        targetValue: target.value,
    }));
}

export const eHandleContentChange = (e: React.ChangeEvent<Element>) => {
    const target = (e.target as HTMLInputElement);
    const index = Number.parseInt(target.dataset['index']!);
    const _subindex = Number.parseInt(target.dataset['index2']!);
    const subindex = isNaN(_subindex) ? null : _subindex;
    store.dispatch(handleContentChange({
        index,
        subindex,
        targetName: target.name,
        targetValue: target.value,
    }));
}

export const eShowConfirmLoadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.dispatch(showConfirmLoadTemplate({
        value: e.target.value,
    }));
    e.target.value = "";
    e.target.blur();
}

export const eHandleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        // Yeah, it takes glock mags.
        if (
            selectedFile.name.indexOf("glock") !== -1 &&
            selectedFile.name.indexOf("mag") !== -1 &&
            selectedFile.name.indexOf(".stl") !== -1
        ) {
            store.dispatch(
                handleInputChange({
                    targetName: "headerArt",
                    targetValue: "Glawk",
                })
            );
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event?.target?.result?.toString();
                if (!result) return;
                store.dispatch(
                    handleJsonChange({
                        value: result,
                    })
                );
            };
            reader.readAsText(selectedFile);
        }
    }
    e.target.value = '';
}

export const eHandleJsonChange = (value: string | undefined, _ev: editor.IModelContentChangedEvent) => {
    store.dispatch(handleJsonChange({
        value: value,
    }));
}

export const eHandleBorderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.dispatch(handleBorderChange({
        value: e.target.value,
    }));
}

export const eAddSection = (e: React.MouseEvent) => {
    e.preventDefault();
    store.dispatch(addSection());
}

export const eDelSection = (e: React.MouseEvent) => {
    e.preventDefault();
    const { index } = (e.target as HTMLButtonElement).dataset;
    const _index = Number.parseInt(index!);
    store.dispatch(delSection({
        index: _index,
    }));
}

export const eMoveSection = (e: React.MouseEvent) => {
    e.preventDefault();
    const { index, direction } = (e.target as HTMLButtonElement).dataset;
    const _index = Number.parseInt(index!);
    store.dispatch(moveSection({
        index: _index,
        direction,
    }));
}

export const eAddSubsection = (e: React.MouseEvent) => {
    e.preventDefault();
    const { index } = (e.target as HTMLButtonElement).dataset;
    const _index = Number.parseInt(index!);
    store.dispatch(addSubsection({
        index: _index,
    }));
}

export const eDelSubsection = (e: React.MouseEvent) => {
    e.preventDefault();
    const { index, index2 } = (e.target as HTMLButtonElement).dataset;
    const _index = Number.parseInt(index!);
    const subindex = Number.parseInt(index2!);
    store.dispatch(delSubsection({
        index: _index,
        subindex,
    }));
}

export const eMoveSubsection = (e: React.MouseEvent) => {
    e.preventDefault();
    const { index, index2, direction } = (e.target as HTMLButtonElement).dataset;
    store.dispatch(moveSubsection({
        index: Number.parseInt(index!),
        subindex: Number.parseInt(index2!),
        direction,
    }));
}

const scrollAndHighlight = (el: HTMLElement | null) => {
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        el.classList.remove('off');
        setTimeout(() => {
            el.classList.add('off');
        }, 2000);
    }
}

export const eHandleInputFocus = (e: React.FocusEvent) => {
    const state = store.getState();
    const isRightNfo = state.app.isRightNfo;
    const lastInput = state.app.lastInput;
    const { index, index2 } = (e.target as HTMLInputElement).dataset;
    const name = (e.target as HTMLInputElement).name;
    const isHeader = name === "header" || name === "subheader";
    const elId = (index + (index2 ? "-" + index2 : "") + (isHeader ? "-h" : "")).toString();
    if (elId !== lastInput) {
        store.dispatch(setLastInput({ lastInput: elId }));
        if (!isRightNfo) return;
        scrollAndHighlight(document.getElementById(rightNfoId + "-" + elId));
    }
}

export const eHandleClickNfo = (e: React.MouseEvent) => {
    const [, i1, i2, h] = (e.target as HTMLElement).id.split('-');
    let selector;
    selector = `[data-index="${i1}"]`;
    switch (i2) {
        case undefined:
            break;
        case "h":
            selector = "input" + selector;
            break;
        default:
            selector += `[data-index2="${i2}"]`;
            break;
    }
    if (h) {
        selector += `[name="subheader"]`;
    } else if (i2 !== "h") {
        if (i1 === "0") {
            selector = "select" + selector;
        } else if (i1 === "1") {
            if (i2 === "1") {
                selector = "textarea" + selector;
            } else {
                selector = "input" + selector;
            }
        } else {
            selector = "textarea" + selector;
        }
    }
    scrollAndHighlight(document.querySelector(selector));
}
