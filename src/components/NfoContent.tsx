import { NfoContentSection } from "./NfoContentSection";


interface NfoContentProps {
    id: string;
    data: any,
    dataOrder: any,
    isRightNfo: boolean;
}

const NfoContent = (props: NfoContentProps) => {
    return (
        <div id={props.id}>
            {props.dataOrder.map((vdoId: string) => {
                return <NfoContentSection
                    key={vdoId}
                    id={props.id}
                    isRightNfo={props.isRightNfo}
                    content={props.data[vdoId]}
                />
            })}
        </div>
    );
};

export default NfoContent;
