// Make a Nav next.js component that renders a <nav> element with a list of links:
import Link from 'next/link'

export default function Nav() {
    return (
        <nav className='nav'>
            <Link href="/">Home</Link>
            <ul>
                <li>
                    <Link href="/riffusion">Riffusion</Link>
                </li>
                <li>
                    <Link href="/zoedepth">Zoe Depth</Link>
                </li>
                <li>
                    <Link href="/sdiffusion">Stable Diffusion 2.0</Link>
                </li>
                <li>
                    <Link href="/sdxl-lcm">Stable Diffusion XL + LCM</Link>
                </li>
            </ul>
            <hr></hr>
        </nav>
    )
}