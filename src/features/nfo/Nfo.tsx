import { editor } from "monaco-editor";
import React from "react";
import store from "../../app/store";
import { addSection, addSubsection, delSection, delSubsection, handleContentChange, handleInputChange, handleJsonChange, handleUpload, loadTemplate } from "./nfoSlice";


export const eHandleInputChange = (e: React.ChangeEvent<Element>)=> {
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
}

export const eLoadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.dispatch(loadTemplate({
        value: e.target.value,
    }));
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
