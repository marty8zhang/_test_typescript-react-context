import React from 'react';
import { render, screen } from '@testing-library/react';
import PostListPage from './PostListPage';
import ServicesContext from '../contexts/ServicesContext';

it('displays a table of the retrieved posts', async () => {
  const mockedGetPostsByUserId = jest.fn().mockResolvedValue([
    {
      userId: 1,
      id: 1,
      title: 'Test Post 1 Title',
      body: 'Test post 1 body',
    },
    {
      userId: 1,
      id: 2,
      title: 'Test Post 2 Title',
      body: 'Test post 2 body',
    },
  ]);
  const mockedServices = {
    postGateway: {
      getPostsByUserId: mockedGetPostsByUserId,
    },
  };

  const { container } = render(
    <ServicesContext.Provider value={mockedServices}>
      <PostListPage userId={1} />
    </ServicesContext.Provider>,
  );

  await screen.findByText('Test Post 1 Title');
  expect(mockedGetPostsByUserId).toBeCalledTimes(1);
  expect(mockedGetPostsByUserId).toBeCalledWith(1);

  const table = container.querySelector('table');
  expect(table).toMatchSnapshot();
});

it('displays a message in the table when no post is retrieved', async () => {
  const mockedGetPostsByUserId = jest.fn().mockResolvedValue([]);
  const mockedServices = {
    postGateway: {
      getPostsByUserId: mockedGetPostsByUserId,
    },
  };

  const { container } = render(
    <ServicesContext.Provider value={mockedServices}>
      <PostListPage userId={2} />
    </ServicesContext.Provider>,
  );
  const message = await screen.findByText('No Post Found.');
  expect(message).toBeInTheDocument();

  const table = container.querySelector('table');
  expect(table).toMatchSnapshot();
});
