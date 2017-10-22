import bcrypt from 'bcrypt';
import _ from 'lodash';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: { args: true, msg: 'The username can only contain letters and numbers' },
          len: {
            args: [3, 45],
            msg: 'The username needs to be between 3 and 45 characters',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid email',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 100],
            msg: 'Password must be at least 3 and no more than 100 characters',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user) => {
          const saltRounds = 12;
          // eslint-disable-next-line no-param-reassign
          // user.password = await bcrypt.hash(user.password, saltRounds);
          _.assignIn(user, {
            password: await bcrypt.hash(user.password, saltRounds),
          });
        },
      },
    },
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: { name: 'userId', field: 'user_id' },
    });
    // M:M
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
