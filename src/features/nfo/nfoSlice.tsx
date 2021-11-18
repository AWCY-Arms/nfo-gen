import { createSlice } from '@reduxjs/toolkit';
import deepClone from '../../helpers';
import { formatJson, NfoData, NfoSection, NfoSubsection, readConfig, TextAlign } from '../../NfoWriter';
import sampleTemplates from '../../templates/examples';
import defaultNfoData from '../../templates/examples/default';
import { blankNfoSectionData, blankNfoSubsectionData } from '../../templates/partials/blank';
import defaultNfoSectionCredits from '../../templates/partials/credits';


interface NfoState {
    nfoData: NfoData,
    nfoJson: string,
}

const initialState: NfoState = {
    nfoData: deepClone(defaultNfoData),
    nfoJson: formatJson(defaultNfoData),
}

export const nfoSlice = createSlice({
    name: 'nfo',
    initialState,
    reducers: {
        handleInputChange: (state, action) => {
            const { targetName, targetValue } = action.payload;
            state.nfoData[targetName] = targetValue;
            state.nfoJson = formatJson(state.nfoData);
        },
        handleContentChange: (state, action) => {
            const index: number = action.payload.index;
            const subindex: number = action.payload.subindex;
            const targetName: string = action.payload.targetName;
            const targetValue: string = action.payload.targetValue;
            let section;
            switch (targetName) {
                case "sectionType":
                    switch (targetValue) {
                        case "credits":
                            section = defaultNfoSectionCredits;
                            break;
                        default:
                            section = blankNfoSectionData;
                            break;
                    }
                    state.nfoData.content[index] = deepClone(section);
                    break;
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
                    } else {
                        section = state.nfoData.content[index] as NfoSection;
                        section.sectionData[targetName] = targetValue.split('\n');
                    }
                    break;
                case "textAlign":
                    if (subindex !== null) {
                        section = state.nfoData.content[index].sectionData.subsections![subindex] as NfoSubsection;
                        section[targetName] = targetValue as TextAlign;
                    } else {
                        section = state.nfoData.content[index] as NfoSection;
                        section.sectionData[targetName] = targetValue as TextAlign;
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
            const config: NfoData = sampleTemplates[action.payload.value][1];
            state.nfoData = config;
            state.nfoJson = formatJson(state.nfoData);
        },
        handleUpload: (state, action) => {
            const jsonText = action.payload.jsonText;
            try {
                const config: NfoData = readConfig(JSON.parse(jsonText));
                state.nfoData = config
                state.nfoJson = formatJson(state.nfoData);
            } catch (e) {
                console.error('Invalid JSON');
            }
        },
        handleJsonChange: (state, action) => {
            try {
                const config: NfoData = JSON.parse(action.payload.value);
                state.nfoData = config;
            } catch {
            }
            state.nfoJson = action.payload.value;
        },
        addSection: (state) => {
            state.nfoData.content.push(deepClone(blankNfoSectionData));
            state.nfoJson = formatJson(state.nfoData);
        },
        delSection: (state, action) => {
            const { index } = action.payload;
            state.nfoData.content.splice(index, 1);
            state.nfoJson = formatJson(state.nfoData);
        },
        moveSection: (state, action) => {
            const { index, direction } = action.payload;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            const content = state.nfoData.content;
            [content[index], content[newIndex]] = [content[newIndex], content[index]];
            state.nfoJson = formatJson(state.nfoData);
        },
        addSubsection: (state, action) => {
            const { index } = action.payload;
            state.nfoData.content[index]!.sectionData!.subsections!.push(deepClone(blankNfoSubsectionData));
            state.nfoJson = formatJson(state.nfoData);
        },
        delSubsection: (state, action) => {
            const { index, subindex } = action.payload;
            state.nfoData.content[index]!.sectionData!.subsections!.splice(subindex, 1);
            state.nfoJson = formatJson(state.nfoData);
        }
    },
})

export const { handleInputChange, handleContentChange, loadTemplate, handleUpload, handleJsonChange, addSection, delSection, moveSection, addSubsection, delSubsection } = nfoSlice.actions

export default nfoSlice.reducer
