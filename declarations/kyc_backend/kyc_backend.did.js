export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'approve_kyc' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'get_kyc_status' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'status' : IDL.Text,
              'user_id' : IDL.Text,
              'document' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'reject_kyc' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'submit_kyc' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
