import gsap from "gsap"
import { useLayoutEffect, useRef, RefObject } from "react"

export function Dice(props: any) {
    const faces = [props.value, ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter(v => v !== props.value))]

    const dice: RefObject<HTMLDivElement> = useRef(null); // Utilisation de RefObject<HTMLDivElement>

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(dice.current, {
                rotationX: 'random(720, 1080)',
                rotationY: 'random(720, 1080)',
                rotationZ: 0,
                duration: 'random(2, 3)'
            })
        }, dice)
        return () => ctx.revert()
    }, [props.value])

    return (
        <div className="dice-container">
            <div className="dice" ref={dice}>
                {faces.map((value, index) => (
                    <div className="face" key={index}>{value}</div> // Ajout de la clé unique pour chaque élément
                ))}
            </div>
        </div>
    )
}
