import { useEffect, useState } from "react";

export function useSimpleCarousel<T> (list: T[]): [T[], () => void] {
    const [ index, setIndex ] = useState<number>(0)
    const [ indexSequence, setIndexSequence ] = useState<number[]>(
        list.map((e, i) => i)
    )

    useEffect(() => {
        if (index === 0) return
        
        setIndexSequence(sequence => {
            const max = sequence.length
            const newSequence: number[] = []
            for (let i of sequence) {
                let newIndex = i + 1
                if (newIndex === max) newIndex = 0
                newSequence.push(newIndex)
            }
            return newSequence
        })
    }, [ index ])

    return [indexSequence.map(e => list[e]), () => { setIndex(i => i+1) }]
}