import { createSlice, nanoid } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import headers from '../../headers';
import sampleTemplates from '../../templates/examples';
import defaultNfoData from '../../templates/examples/default';
import { blankNfoSectionData, blankNfoSubsectionData } from '../../templates/partials/blank';
import { cleanText, deepClone, IMap } from '../../utils/helpers';
import { NfoContentSection, NfoData, NfoSection, NfoSubsection, TextAlign } from '../../utils/NfoDefs';
import {
    getNCS,
    getSectionNCS,
    getSepPre,
    getSubsectionNCS,
    horizontalAlign,
    importJson,
    renderHeader,
    renderSubheader,
    renderText
} from '../../utils/NfoWriter';
import { defaultNfoWidth } from '../../utils/NfoWriterSettings';


interface NfoState {
    nfoData: NfoData,
    viewData: IMap<NfoContentSection>,
    viewDataOrder: string[],
}

function getInitialState(): NfoState {
    const data = importJson(defaultNfoData);
    const [viewData, viewDataOrder] = getNCS(data);
    return {
        nfoData: data,
        viewData: viewData,
        viewDataOrder: viewDataOrder,
    }
}

const initialState: NfoState = getInitialState();

function getOrderIds(section: NfoSection): string[] {
    return [section.oId!, ...section.sectionData.subsections.flatMap(subsection => [subsection.oId1!, subsection.oId2!])];
}

function setNcsHeader(state: WritableDraft<NfoState>, index: number, text: string) {
    state.nfoData.content[index].header = text;
    const vdoId = state.nfoData.content[index].oId!;
    state.viewData[vdoId].sepPre = getSepPre(state.viewData[vdoId].id, true).join("\n");
    state.viewData[vdoId].text = renderHeader(text);
}

function setNcsSubheader(state: WritableDraft<NfoState>, i1: number, i2: number, text: string) {
    state.nfoData.content[i1].sectionData.subsections![i2].subheader = text;
    const vdoId = state.nfoData.content[i1].sectionData.subsections![i2].oId1!;
    state.viewData[vdoId].sepPre = getSepPre(state.viewData[vdoId].id, text.length > 0).join("\n");
    state.viewData[vdoId].text = text ? renderSubheader(text) : '';
}

function setNcsText(state: WritableDraft<NfoState>, i1: number, i2: number, text?: string[]) {
    const section = state.nfoData.content[i1];
    const subsection = section.sectionData.subsections![i2];
    if (text !== undefined) subsection.text = text;
    const vdoId = state.nfoData.content[i1].sectionData.subsections![i2].oId2!;
    const rText = renderText(subsection, section, i2).join("\n");
    state.viewData[vdoId].sepPre = getSepPre(state.viewData[vdoId].id, rText.length > 0).join("\n");
    state.viewData[vdoId].text = rText;

    // Editing a credits4-styled subsection may affect the credits3-styled subsection before it
    if (subsection.textStyle === 'credits4') {
        setNcsText(state, i1, i2 - 1);
    }
}

function setNcsTextStyle(state: WritableDraft<NfoState>, i1: number, i2: number, text: string) {
    const section = state.nfoData.content[i1];
    const subsection = section.sectionData.subsections![i2];
    subsection.textStyle = text as TextAlign;
    const vdoId = state.nfoData.content[i1].sectionData.subsections![i2].oId2!;
    const rText = renderText(subsection, section, i2).join("\n");
    state.viewData[vdoId].sepPre = getSepPre(state.viewData[vdoId].id, rText.length > 0).join("\n");
    state.viewData[vdoId].text = rText;
}

function createSection(index: number): [NfoSection, NfoContentSection[], string[]] {
    const vdoIds = [];
    const section = deepClone(blankNfoSectionData);
    section.oId = nanoid();
    vdoIds.push(section.oId);
    section.sectionData.subsections.forEach(subsection => {
        subsection.oId1 = nanoid();
        subsection.oId2 = nanoid();
        vdoIds.push(subsection.oId1, subsection.oId2)
    });
    const viewData = getSectionNCS(section, index);
    return [section, viewData, vdoIds];
}

function createSubsection(i1: number, i2: number): [NfoSubsection, NfoContentSection[], string[]] {
    const subsection = deepClone(blankNfoSubsectionData);
    subsection.oId1 = nanoid();
    subsection.oId2 = nanoid();
    const vdoIds = [subsection.oId1, subsection.oId2];
    const viewData = getSubsectionNCS(subsection, i1, i2, '');
    return [subsection, viewData, vdoIds];
}

function updateId(ncs: NfoContentSection) {
    ncs.id = ncs.i1 + "-" + ncs.i2 + (ncs.h ? "-h" : "");
}

function updateSepPre(ncs: NfoContentSection) {
    ncs.sepPre = getSepPre(ncs.id, ncs.text.length > 0).join("\n");
}

function _loadTemplate(state: WritableDraft<NfoState>, action: { payload: any, type: string }) {
    const config = sampleTemplates[action.payload.value][1];
    state.nfoData = importJson(typeof config === "function" ? config() : config);
    [state.viewData, state.viewDataOrder] = getNCS(state.nfoData);
}

export const nfoSlice = createSlice({
    name: 'nfo',
    initialState,
    reducers: {
        handleInputChange: (state, action) => {
            const { targetName, targetValue } = action.payload;
            state.nfoData[targetName] = targetValue;
            switch (targetName) {
                case "headerArt":
                case "headerAlign":
                    const text = horizontalAlign((headers)[state.nfoData.headerArt] || "", state.nfoData.headerAlign, defaultNfoWidth, false);
                    state.nfoData.content[0].sectionData.subsections[0].text = text;
                    const vdoId = state.nfoData.content[0].sectionData.subsections![0].oId2!;
                    state.viewData[vdoId].sepPre = getSepPre(state.viewData[vdoId].id, true).join("\n");
                    state.viewData[vdoId].text = text.join("\n");
                    break;
                case "title":
                    setNcsText(state, 1, 0, [targetValue]);
                    break;
                case "description":
                    setNcsText(state, 1, 1, [targetValue]);
                    break;
                case "version":
                    setNcsText(state, 1, 2, [targetValue]);
                    break;
            }
        },
        handleContentChange: (state, action) => {
            const i1: number = action.payload.index;
            const i2: number = action.payload.subindex;
            const targetName: string = action.payload.targetName;
            const targetValue = cleanText(action.payload.targetValue);
            switch (targetName) {
                case "subheader":
                    setNcsSubheader(state, i1, i2, targetValue);
                    break;
                case "text":
                    setNcsText(state, i1, i2, targetValue.split('\n'));
                    break;
                case "textStyle":
                    setNcsTextStyle(state, i1, i2, targetValue);
                    break;
                case "header":
                    setNcsHeader(state, i1, targetValue);
                    break;
            }
        },
        loadTemplate: (state, action) => {
            _loadTemplate(state, action);
        },
        handleJsonChange: (state, action) => {
            try {
                const validated = importJson(action.payload.value);
                state.nfoData = validated;
                [state.viewData, state.viewDataOrder] = getNCS(validated);
            } catch (e) {
                console.error(e);
            }
        },
        addSection: (state) => {
            if (!state.nfoData.content) {
                _loadTemplate(state, { payload: { value: "default" }, type: "nfo/addSection" });
            }
            // nfoData
            const footer = state.nfoData.content.splice(-1, 1)[0];
            const footerOrder = state.viewDataOrder.splice(state.viewDataOrder.indexOf(footer.oId!));
            const index = state.nfoData.content.length;
            const [section, viewData, vdoIds] = createSection(index);
            state.nfoData.content.push(section, footer);
            // viewData
            viewData.forEach(vd => state.viewData[vd.oId] = vd);
            // viewDataOrder
            state.viewDataOrder.push(...vdoIds, ...footerOrder);
        },
        delSection: (state, action) => {
            const { index } = action.payload;
            // nfoData
            const section = state.nfoData.content.splice(index, 1)[0];
            // viewData
            const vdoIds = getOrderIds(section);
            vdoIds.forEach(i => {
                delete state.viewData[i];
            });
            // viewDataOrder
            const vdoI1 = state.viewDataOrder.indexOf(vdoIds[0]);
            if (vdoI1 === -1) return;
            state.viewDataOrder.splice(vdoI1, vdoIds.length);
        },
        moveSection: (state, action) => {
            const { index, direction } = action.payload;
            const content = state.nfoData.content;
            const index1 = direction === 'up' ? index - 1 : index;
            const index2 = direction === 'up' ? index : index + 1;
            // viewData
            const sec1vdoIds = getOrderIds(content[index1]);
            sec1vdoIds.forEach(i => {
                state.viewData[i].i1 = index2;
                updateId(state.viewData[i]);
            });
            const sec2vdoIds = getOrderIds(content[index2]);
            sec2vdoIds.forEach(i => {
                state.viewData[i].i1 = index1;
                updateId(state.viewData[i]);
            });
            // viewDataOrder
            const vdoI1 = state.viewDataOrder.indexOf(content[index1].oId!);
            const vdoI2 = state.viewDataOrder.indexOf(content[index2].oId!);
            state.viewDataOrder = [
                ...state.viewDataOrder.slice(0, vdoI1),
                ...state.viewDataOrder.slice(vdoI2, vdoI2 + sec2vdoIds.length),
                ...state.viewDataOrder.slice(vdoI1, vdoI1 + sec1vdoIds.length),
                ...state.viewDataOrder.slice(vdoI2 + sec2vdoIds.length),
            ];
            // nfoData
            [content[index1], content[index2]] = [content[index2], content[index1]];
        },
        addSubsection: (state, action) => {
            const { index } = action.payload;
            // Get next subindex
            const i2 = state.nfoData.content[index].sectionData.subsections.length;
            const [subsection, viewData, vdoIds] = createSubsection(index, i2);
            // nfoData
            state.nfoData.content[index]!.sectionData!.subsections!.push(subsection);
            // viewData
            viewData.forEach(vd => state.viewData[vd.oId] = vd);
            // viewDataOrder
            const vdoI = state.viewDataOrder.indexOf(state.nfoData.content[index].sectionData.subsections[i2 - 1].oId2!);
            if (vdoI === -1) return;
            state.viewDataOrder = [
                ...state.viewDataOrder.slice(0, vdoI + 1),
                ...vdoIds,
                ...state.viewDataOrder.slice(vdoI + 1),
            ];
        },
        delSubsection: (state, action) => {
            const { index, subindex } = action.payload;
            // nfoData
            const subsection = state.nfoData.content[index]!.sectionData!.subsections!.splice(subindex, 1)[0];
            // viewData
            [subsection.oId1!, subsection.oId2!].forEach(k => {
                delete state.viewData[k];
            });
            // viewDataOrder
            const vdoI = state.viewDataOrder.indexOf(subsection.oId1!);
            if (vdoI === -1) return;
            state.viewDataOrder.splice(vdoI, 2);
        },
        moveSubsection: (state, action) => {
            const { index, subindex, direction } = action.payload;
            const index1 = direction === 'up' ? subindex - 1 : subindex;
            const index2 = direction === 'up' ? subindex : subindex + 1;
            const subsecs = state.nfoData.content[index].sectionData.subsections;
            // nfoData
            [subsecs[index1], subsecs[index2]] = [subsecs[index2], subsecs[index1]];
            // viewDataOrder
            const vdoI1 = state.viewDataOrder.indexOf(subsecs[index1].oId1!);
            const vdoI2 = state.viewDataOrder.indexOf(subsecs[index2].oId1!);
            if (vdoI1 !== -1 && vdoI2 !== -1) {
                // Swap the two content sections
                [state.viewDataOrder[vdoI1], state.viewDataOrder[vdoI2]] = [state.viewDataOrder[vdoI2], state.viewDataOrder[vdoI1]];
                [state.viewDataOrder[vdoI1 + 1], state.viewDataOrder[vdoI2 + 1]] = [state.viewDataOrder[vdoI2 + 1], state.viewDataOrder[vdoI1 + 1]];
            }
            // viewData -- Each subsection has two NfoContentSections
            [index1, index2].forEach(i => {
                [subsecs[i].oId1!, subsecs[i].oId2!].forEach(j => {
                    state.viewData[j].i2 = i;
                    updateId(state.viewData[j]);
                    updateSepPre(state.viewData[j]);
                })
            });
        },
    },
})

export const { handleInputChange, handleContentChange, loadTemplate, handleJsonChange, addSection, delSection, moveSection, addSubsection, delSubsection, moveSubsection } = nfoSlice.actions

export default nfoSlice.reducer
