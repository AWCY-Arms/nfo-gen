import { createSlice } from '@reduxjs/toolkit';
import Ajv from "ajv";
import schemaNfo from "../../NfoSchema.json";
import sampleTemplates from '../../templates/examples';
import defaultNfoData from '../../templates/examples/default';
import { blankNfoSectionData, blankNfoSubsectionData } from '../../templates/partials/blank';
import deepClone from '../../utils/helpers';
import { formatJson, NfoData, NfoSection, nfoSectionOffset, NfoSubsection, readConfig, TextAlign } from '../../utils/NfoWriter';


interface NfoState {
    nfoData: NfoData,
    nfoJson: string,
}

const initialState: NfoState = {
    nfoData: deepClone(defaultNfoData),
    nfoJson: formatJson(defaultNfoData),
}

function clean(text: string) {
    return text.replace(/\t/g, "    ");
}

const ajv = new Ajv();
const validate = ajv.compile(schemaNfo);

export const nfoSlice = createSlice({
    name: 'nfo',
    initialState,
    reducers: {
        handleInputChange: (state, action) => {
            const { targetName, targetValue } = action.payload;
            state.nfoData[targetName] = clean(targetValue);
            state.nfoJson = formatJson(state.nfoData);
        },
        handleContentChange: (state, action) => {
            const index: number = action.payload.index - nfoSectionOffset;
            const subindex: number = action.payload.subindex;
            const targetName: string = action.payload.targetName;
            const targetValue = clean(action.payload.targetValue);
            let section;
            switch (targetName) {
                case "subheader":
                    if (subindex !== null) {
                        section = state.nfoData.content[index].sectionData.subsections![subindex] as NfoSubsection;
                        section[targetName] = targetValue;
                    }
                    break;
                case "text":
                    if (subindex !== null) {
                        section = state.nfoData.content[index].sectionData.subsections![subindex] as NfoSubsection;
                        section[targetName] = targetValue.split('\n')
                    }
                    break;
                case "textStyle":
                    if (subindex !== null) {
                        section = state.nfoData.content[index].sectionData.subsections![subindex] as NfoSubsection;
                        section[targetName] = targetValue as TextAlign;
                    }
                    break;
                default:
                    section = state.nfoData.content[index] as NfoSection
                    section[targetName] = targetValue;
                    break;
            }
            state.nfoJson = formatJson(state.nfoData);
        },
        loadTemplate: (state, action) => {
            const config = sampleTemplates[action.payload.value][1];
            state.nfoData = typeof config === "function" ? config() : config;
            state.nfoJson = formatJson(state.nfoData);
        },
        handleUpload: (state, action) => {
            const jsonText = action.payload.jsonText;
            try {
                const config = readConfig(JSON.parse(clean(jsonText)));
                if (!validate(config)) throw validate.errors;
                state.nfoData = config;
                state.nfoJson = formatJson(state.nfoData);
                // TODO If right column is visible, scroll it to the top.
            } catch (e) {
                console.error(e);
                // TODO Show an error.
            }
        },
        handleJsonChange: (state, action) => {
            try {
                const config = JSON.parse(clean(action.payload.value));
                if (!validate(config)) throw validate.errors;
                state.nfoData = config as NfoData;
            } catch (e) {
                console.error(e);
            }
            state.nfoJson = action.payload.value;
        },
        addSection: (state) => {
            if (!state.nfoData.content) {
                state.nfoData = deepClone(defaultNfoData);
            }
            state.nfoData.content.push(deepClone(blankNfoSectionData));
            state.nfoJson = formatJson(state.nfoData);
        },
        delSection: (state, action) => {
            const { index } = action.payload;
            state.nfoData.content.splice(index - nfoSectionOffset, 1);
            state.nfoJson = formatJson(state.nfoData);
        },
        moveSection: (state, action) => {
            const { index, direction } = action.payload;
            const oldIndex = index - nfoSectionOffset;
            const newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1;
            const content = state.nfoData.content;
            [content[oldIndex], content[newIndex]] = [content[newIndex], content[oldIndex]];
            state.nfoJson = formatJson(state.nfoData);
        },
        addSubsection: (state, action) => {
            const { index } = action.payload;
            state.nfoData.content[index - nfoSectionOffset]!.sectionData!.subsections!.push(deepClone(blankNfoSubsectionData));
            state.nfoJson = formatJson(state.nfoData);
        },
        delSubsection: (state, action) => {
            const { index, subindex } = action.payload;
            state.nfoData.content[index - nfoSectionOffset]!.sectionData!.subsections!.splice(subindex, 1);
            state.nfoJson = formatJson(state.nfoData);
        },
        moveSubsection: (state, action) => {
            const { index, subindex, direction } = action.payload;
            const newSubindex: number = direction === 'up' ? subindex - 1 : subindex + 1;
            const content = state.nfoData.content[index - nfoSectionOffset].sectionData.subsections;
            [content[subindex], content[newSubindex]] = [content[newSubindex], content[subindex]];
            state.nfoJson = formatJson(state.nfoData);
        },
    },
})

export const { handleInputChange, handleContentChange, loadTemplate, handleUpload, handleJsonChange, addSection, delSection, moveSection, addSubsection, delSubsection, moveSubsection } = nfoSlice.actions

export default nfoSlice.reducer
