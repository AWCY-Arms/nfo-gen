import { createSlice, nanoid } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import headers from '../../headers';
import sampleTemplates from '../../templates/examples';
import defaultNfoData from '../../templates/examples/default';
import { blankNfoSectionData, blankNfoSubsectionData } from '../../templates/partials/blank';
import { cleanText, deepClone, IMap } from '../../utils/helpers';
import { Border, NfoContentSection, NfoData, NfoSection, NfoSubsection, TextAlign } from '../../utils/NfoDefs';
import {
    getBorders,
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
    state.viewData[vdoId].sepPre = getSepPre(state.nfoData._borders!, state.viewData[vdoId].id, true).join("\n");
    state.viewData[vdoId].text = renderHeader(state.nfoData._borders!, text);
}

function setNcsSubheader(state: WritableDraft<NfoState>, i1: number, i2: number, text: string) {
    state.nfoData.content[i1].sectionData.subsections![i2].subheader = text;
    const vdoId = state.nfoData.content[i1].sectionData.subsections![i2].oId1!;
    state.viewData[vdoId].sepPre = getSepPre(state.nfoData._borders!, state.viewData[vdoId].id, text.length > 0).join("\n");
    state.viewData[vdoId].text = text ? renderSubheader(state.nfoData._borders!, text) : '';
}

function setNcsText(state: WritableDraft<NfoState>, i1: number, i2: number | null, text?: string[]) {
    const section = state.nfoData.content[i1];
    if (i2 === null) return;
    const subsection = section.sectionData.subsections![i2];
    if (text !== undefined) subsection.text = text;
    const vdoId = subsection.oId2!;
    const rText = renderText(state.nfoData._borders!, subsection, section, i2).join("\n");
    state.viewData[vdoId].sepPre = getSepPre(state.nfoData._borders!, state.viewData[vdoId].id, rText.length > 0).join("\n");
    state.viewData[vdoId].text = rText;

    // Editing a credits4-styled subsection may affect the credits3-styled subsection before it.
    // Rerender the previous subsection's text if there is one.
    if (subsection.textStyle === 'credits4' && i2 > 0) {
        setNcsText(state, i1, i2 - 1);
    }
}

function setNcsTextStyle(state: WritableDraft<NfoState>, i1: number, i2: number, text: string) {
    const section = state.nfoData.content[i1];
    const subsection = section.sectionData.subsections![i2];
    subsection.textStyle = text as TextAlign;
    const vdoId = state.nfoData.content[i1].sectionData.subsections![i2].oId2!;
    const rText = renderText(state.nfoData._borders!, subsection, section, i2).join("\n");
    state.viewData[vdoId].sepPre = getSepPre(state.nfoData._borders!, state.viewData[vdoId].id, rText.length > 0).join("\n");
    state.viewData[vdoId].text = rText;
}

function createSection(border: Border, index: number): [NfoSection, NfoContentSection[], string[]] {
    const vdoIds = [];
    const section = deepClone(blankNfoSectionData);
    section.oId = nanoid();
    vdoIds.push(section.oId);
    section.sectionData.subsections.forEach(subsection => {
        subsection.oId1 = nanoid();
        subsection.oId2 = nanoid();
        vdoIds.push(subsection.oId1, subsection.oId2);
    });
    const viewData = getSectionNCS(border, section, index);
    return [section, viewData, vdoIds];
}

function createSubsection(border: Border, i1: number, i2: number): [NfoSubsection, NfoContentSection[], string[]] {
    const subsection = deepClone(blankNfoSubsectionData);
    subsection.oId1 = nanoid();
    subsection.oId2 = nanoid();
    const vdoIds = [subsection.oId1, subsection.oId2];
    const viewData = getSubsectionNCS(border, subsection, i1, i2, '');
    return [subsection, viewData, vdoIds];
}

function updateId(ncs: NfoContentSection) {
    ncs.id = ncs.i1 + (ncs.i2 !== null ? "-" + ncs.i2 : '') + (ncs.h ? "-h" : "");
}

function updateSepPre(border: Border, ncs: NfoContentSection) {
    ncs.sepPre = getSepPre(border, ncs.id, ncs.text.length > 0).join("\n");
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
                    state.viewData[vdoId].sepPre = getSepPre(state.nfoData._borders!, state.viewData[vdoId].id, true).join("\n");
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
        handleBorderChange: (state, action) => {
            state.nfoData.borderStyle = action.payload.value;
            state.nfoData._borders = getBorders(action.payload.value);
            [state.viewData, state.viewDataOrder] = getNCS(state.nfoData);
        },
        addSection: (state) => {
            if (!state.nfoData.content) {
                _loadTemplate(state, { payload: { value: "default" }, type: "nfo/addSection" });
            }
            // nfoData
            const footer = state.nfoData.content.splice(-1, 1)[0];
            const footerOrderIds = state.viewDataOrder.splice(state.viewDataOrder.indexOf(footer.oId!));
            const index = state.nfoData.content.length;
            const [section, viewData, vdoIds] = createSection(state.nfoData._borders!, index);
            state.nfoData.content.push(section, footer);
            // viewData
            viewData.forEach(vd => state.viewData[vd.oId] = vd);
            footerOrderIds.forEach(oId => {
                const ncs = state.viewData[oId];
                ncs.i1++;
                updateId(ncs);
            });
            // viewDataOrder
            state.viewDataOrder.push(...vdoIds, ...footerOrderIds);
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
            const vdoIndex = state.viewDataOrder.indexOf(vdoIds[0]);
            if (vdoIndex === -1) return;
            state.viewDataOrder.splice(vdoIndex, vdoIds.length);
            // Decrement index1 on all subsequent NCS
            state.viewDataOrder.slice(vdoIndex).forEach(oId => {
                const ncs = state.viewData[oId];
                ncs.i1--;
                updateId(ncs);
            });
        },
        moveSection: (state, action) => {
            const { index, direction } = action.payload;
            const content = state.nfoData.content;
            const index1 = direction === 'up' ? index - 1 : index;
            const index2 = direction === 'up' ? index : index + 1;
            // viewData
            const section1vdoIds = getOrderIds(content[index1]);
            section1vdoIds.forEach(oId => {
                state.viewData[oId].i1 = index2;
                updateId(state.viewData[oId]);
            });
            const section2vdoIds = getOrderIds(content[index2]);
            section2vdoIds.forEach(oId => {
                state.viewData[oId].i1 = index1;
                updateId(state.viewData[oId]);
            });
            // viewDataOrder
            const vdoI1 = state.viewDataOrder.indexOf(content[index1].oId!);
            const vdoI2 = state.viewDataOrder.indexOf(content[index2].oId!);
            state.viewDataOrder = [
                ...state.viewDataOrder.slice(0, vdoI1),
                ...state.viewDataOrder.slice(vdoI2, vdoI2 + section2vdoIds.length),
                ...state.viewDataOrder.slice(vdoI1, vdoI1 + section1vdoIds.length),
                ...state.viewDataOrder.slice(vdoI2 + section2vdoIds.length),
            ];
            // nfoData
            [content[index1], content[index2]] = [content[index2], content[index1]];
        },
        addSubsection: (state, action) => {
            const { index } = action.payload;
            // Get next subindex
            const i2 = state.nfoData.content[index].sectionData.subsections.length;
            const [subsection, viewData, vdoIds] = createSubsection(state.nfoData._borders!, index, i2);
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
            const subindex1 = direction === 'up' ? subindex - 1 : subindex;
            const subindex2 = direction === 'up' ? subindex : subindex + 1;
            const subsections = state.nfoData.content[index].sectionData.subsections;
            // nfoData
            [subsections[subindex1], subsections[subindex2]] = [subsections[subindex2], subsections[subindex1]];
            // viewDataOrder
            const vdoI1 = state.viewDataOrder.indexOf(subsections[subindex1].oId1!);
            const vdoI2 = state.viewDataOrder.indexOf(subsections[subindex2].oId1!);
            if (vdoI1 !== -1 && vdoI2 !== -1) {
                // Swap the two content sections
                [state.viewDataOrder[vdoI1], state.viewDataOrder[vdoI2]] = [state.viewDataOrder[vdoI2], state.viewDataOrder[vdoI1]];
                [state.viewDataOrder[vdoI1 + 1], state.viewDataOrder[vdoI2 + 1]] = [state.viewDataOrder[vdoI2 + 1], state.viewDataOrder[vdoI1 + 1]];
            }
            // viewData -- Each subsection has two NfoContentSections
            [subindex1, subindex2].forEach(i => {
                [subsections[i].oId1!, subsections[i].oId2!].forEach(j => {
                    state.viewData[j].i2 = i;
                    updateId(state.viewData[j]);
                    updateSepPre(state.nfoData._borders!, state.viewData[j]);
                });
            });
        },
    },
});

export const { handleInputChange, handleContentChange, loadTemplate, handleJsonChange, handleBorderChange, addSection, delSection, moveSection, addSubsection, delSubsection, moveSubsection } = nfoSlice.actions

export default nfoSlice.reducer;
