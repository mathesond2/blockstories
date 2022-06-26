import * as React from 'react';
import Link from 'next/link';
import {
  Container,
  Input,
  Button

 } from '@chakra-ui/react'

const Nav = () => (
  <Container maxW="container.xl" className="top-nav">
    <nav>
      <ul className="link-list">
        <li className="link-list__item">
          <Link href='/'>BlockStories</Link>
        </li>
        <li className="link-list__item">
          <Input placeholder='search...' />
        </li>
        <li className="link-list__item">
          <Link href='/explore'>Explore</Link>
        </li>
        <li className="link-list__item">
          <Link href='/create'>Create</Link>
        </li>
      </ul>
    </nav>

    <Button variant='outline'>Login</Button>
  </Container>
);

export default Nav;
