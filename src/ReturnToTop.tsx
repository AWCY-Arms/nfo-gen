import { Button } from "react-bootstrap"


interface ReturnToTopProps {
    id: string,
}

export function ReturnToTop(props: ReturnToTopProps) {
    return <div className="my-3 text-center">
        <Button size="sm" variant="link" onClick={() => { document.getElementById(props.id)?.scrollIntoView({ behavior: "smooth" }) }}>Return to Top</Button>
    </div>
}

export default ReturnToTop;
