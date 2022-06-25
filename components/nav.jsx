import * as React from 'react';
import Link from 'next/link';
import { Container } from '@chakra-ui/react'

const Nav = () => (
  <Container maxW="container.xl" className="top-nav">
    <strong>
      <Link href='/'>BlockStories</Link>
    </strong>

    <nav>
      <ul className="link-list">
        <li className="link-list__item">
          <Link href='/my-stories'>my stories</Link>
        </li>
        <li className="link-list__item">
          <Link href='/dashboard'>dashboard</Link>
        </li>
        <li className="link-list__item">
          <Link href="/about">about</Link>
        </li>
      </ul>
    </nav>
  </Container>
);

export default Nav;
