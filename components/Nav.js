// Make a Nav next.js component that renders a <nav> element with a list of links:
import Link from 'next/link'

export default function Nav() {
    return (
        <nav className='nav'>
            <Link href="/">Home</Link>
            <ul>
                <li>
                    <Link href="/riffusion">Music</Link>
                </li>
                <li>
                    <Link href="/zoedepth">Depth</Link>
                </li>
                <li>
                    <Link href="/esrgan">Upscale</Link>
                </li>
                <li>
                    <Link href="/sdiffusion">Stable Diffusion 2.0</Link>
                </li>
                <li>
                    <Link href="/sdxl-lcm">Stable Diffusion XL</Link>
                </li>
            </ul>
            <hr></hr>
        </nav>
    )
}