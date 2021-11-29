import { editor } from "monaco-editor";
import React from "react";
import store from "../../app/store";
import { setLastInput } from "../app/appSlice";
import { addSection, addSubsection, delSection, delSubsection, handleContentChange, handleInputChange, handleJsonChange, handleUpload, loadTemplate, moveSection } from "./nfoSlice";


export const eHandleInputChange = (e: React.ChangeEvent<Element>) => {
    const target = e.target as HTMLInputElement;
    store.dispatch(handleInputChange({
        targetName: target.name,
        targetValue: target.value,
    }));
}

export const eHandleContentChange = (e: React.ChangeEvent<Element>) => {
    const target = (e.target as HTMLInputElement)
    const index = Number.parseInt(target.dataset['index']!);
    const _subindex = Number.parseInt(target.dataset['index2']!);
    const subindex = isNaN(_subindex) ? null : _subindex;
    store.dispatch(handleContentChange({
        index,
        subindex,
        targetName: target.name,
        targetValue: target.value,
    }));
    if (target.tagName === "TEXTAREA") {
        target.style.height = target.scrollHeight + "px";
    }
}

export const eLoadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.dispatch(loadTemplate({
        value: e.target.value,
    }));
    e.target.value = "";
    e.target.blur();
}

export const eHandleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event?.target?.result?.toString();
        if (!result) return;
        store.dispatch(handleUpload({
            jsonText: result,
        }));
    };
    if (selectedFile) {
        reader.readAsText(selectedFile);
    }
    e.target.value = '';
}

export const eHandleJsonChange = (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
    store.dispatch(handleJsonChange({
        value: value,
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

const scrollAndHighlight = (el: Element | null) => {
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
    const visibleNfo = state.app.nfo;
    const lastInput = state.app.lastInput;
    const { index, index2, section } = (e.target as HTMLInputElement).dataset;
    let elId;
    if (section) {
        elId = section;
    } else {
        const name = (e.target as HTMLInputElement).name;
        elId = "section-" + index + (index2 !== undefined ? "-" + index2 : "") + (name?.indexOf("header") !== -1 ? "-h" : "");
    }
    if (elId !== lastInput) {
        store.dispatch(setLastInput({ lastInput: elId }));
        if (visibleNfo !== 1) return;
        scrollAndHighlight(document.getElementById("content" + visibleNfo + "-" + elId));
    }
}

export const eHandleClickNfo = (e: React.MouseEvent) => {
    const [, sectionType, i1, i2, h] = (e.target as HTMLElement).id.split('-');
    let selector;
    if (sectionType === "main") {
        selector = `[data-section="main"]`;
    } else {
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
            selector = "textarea" + selector;
        }
    }
    scrollAndHighlight(document.querySelector(selector));
}
