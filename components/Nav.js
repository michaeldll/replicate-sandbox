// Make a Nav next.js component that renders a <nav> element with a list of links:
import Link from 'next/link'

export default function Nav() {
    return (
        <nav className='nav'>
            <Link href="/">Home</Link>
            <ul className='nav-ul'>
                <li>
                    <Link className='nav-link' href="/riffusion">Music</Link>
                </li>
                <li>
                    <Link className='nav-link' href="/zoedepth">Depth</Link>
                </li>
                <li>
                    <Link className='nav-link' href="/esrgan">Upscale</Link>
                </li>
                <li>
                    <Link className='nav-link' href="/sdiffusion">Stable Diffusion 2.0</Link>
                </li>
                <li>
                    <Link className='nav-link' href="/sdxl-lcm">Stable Diffusion XL</Link>
                </li>
            </ul >
            <hr></hr>
        </nav >
    )
}