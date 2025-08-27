import type { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
    },
  ],
  access: {
    // Only admins can create, read, update, and delete users
    create: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') {
        return true
      }
      return false
    },
    read: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') {
        return true
      }
      // Users can read their own profile
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'super-admin' || user?.role === 'admin') {
        return true
      }
      // Users can update their own profile
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'super-admin') {
        return true
      }
      return false
    },
  },
}

export default Users