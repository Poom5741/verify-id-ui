export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'delete_identity' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'get_identity' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'did' : IDL.Text,
              'name' : IDL.Text,
              'email' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'register_identity' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'update_identity' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
