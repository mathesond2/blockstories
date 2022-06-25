import * as React from 'react';
import Link from 'next/link';

const Footer = () => (
    <footer className='footer'>
      <ul className="link-list">
        <li className="link-list__item">
        <Link href='/'>&copy; BlockStories</Link>

        </li>
        <li className="link-list__item">
          <Link href='/about'>About</Link>
        </li>
        <li className="link-list__item">
          <Link href='/dashboard'>Privacy</Link>
        </li>
      </ul>
      <p>Thanks to <Link href="http://lens.xyz/" target="_blank" rel="noopener noreferrer">Lens Protocol</Link>, <Link href="https://ipfs.io/" target="_blank" rel="noopener noreferrer">IPFS</Link>, and  <Link href="https://www.covalenthq.com/" target="_blank" rel="noopener noreferrer">Covalent</Link>.</p>
    </footer>
);

export default Footer;
