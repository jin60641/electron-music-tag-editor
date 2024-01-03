import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { getFilenameFromPath } from 'utils/common';

const DialogContentText = withStyles(() => ({ root: { whiteSpace: 'pre-wrap' } }))(MuiDialogContentText);


interface Props {
  selectedRows: Music[],
  isOpen: boolean;
  onClose: () => void;
}

const RemoveConfirm: React.FC<Props> = ({ selectedRows, onClose, isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const filePaths = React.useMemo(() => selectedRows.map(({ path }) => path), [selectedRows]);
  const handleRemoveFiles = () => {
    onClose();
    dispatch(musicActions.removeMusics({ filePaths, shouldRemoveFiles: true }));
  };
  const handleRemoveRows = () => {
    onClose();
    dispatch(musicActions.removeMusics({ filePaths, shouldRemoveFiles: false }));
  };
  const handleCancel = () => {
    onClose();
  };
  const fileCount = t('fileCount', { count: selectedRows.length });
  return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby='remove-confirm-title'
        aria-describedby='remove-confirm-description'
      >
        <DialogTitle id='remove-confirm-title'>
        {t('remove_dialog_title', {
          fileCount,
          rowCount: t('rowCount', {
            row: selectedRows.length ? (selectedRows[0].metadata.title || getFilenameFromPath(selectedRows[0].path)) : 'asdf',
            count: selectedRows.length - 1,
          }),
        })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='remove-confirm-description'>
            {t('remove_dialog_desc', { keep_file: t('keep_file', { fileCount }), fileCount })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='secondary' onClick={handleRemoveFiles}>
            {t('move_to_trash')}
          </Button>
          <Button variant='contained' color='primary' onClick={handleRemoveRows} autoFocus>
            {t('keep_file', { fileCount })}
          </Button>
          <Button variant='contained' onClick={handleCancel}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default RemoveConfirm;
