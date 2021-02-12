import React, {
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import layoutActions from 'store/layout/actions';
import { AlertType } from 'store/layout/types';
import actions from 'store/music/actions';
import { InputPicture } from 'store/music/types';
import { RootState } from 'store/types';
import { getImageSize, Size } from 'utils/image';
import { readFileSync } from 'utils/music';

const useStyles = makeStyles((theme) => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',
  },
  label: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    paddingTop: 'calc(100% - 2px)',
    borderRadius: 4,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    border: `1px solid ${theme.palette.grey[400]}`,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  drag: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    background: `linear-gradient(90deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(90deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(0deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(0deg, ${theme.palette.grey[400]} 50%, transparent 50%)`,
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '15px 4px, 15px 4px, 4px 15px, 4px 15px',
    animation: '$border-dance 20s infinite linear',
    display: 'none',
  },
  '@keyframes border-dance': {
    '0%': { backgroundPosition: '0 0, 100% 100%, 0 100%, 100% 0' },
    '100%': { backgroundPosition: '100% 0, 0 100%, 0 0, 100% 100%' },
  },
  size: { height: 0 },
  dragging: { display: 'block' },
}));

const initialSize: Size = { width: 0, height: 0 };

interface ContextAnchor {
  mouseX: null | number,
  mouseY: null | number,
}

const selector = ({
  music: {
    input: {
      picture,
      values: {
        artist: { value: artist },
        album: { value: album },
      },
    },
  },
}: RootState) => ({
  value: picture,
  releaseTitle: (artist && album) ? `${artist} - ${album}` : undefined,
});

const initialContextAnchor: ContextAnchor = {
  mouseX: null,
  mouseY: null,
};

const ImageInput: FC = () => {
  const { releaseTitle, value } = useSelector(selector);
  const dispatch = useDispatch();
  const [contextAnchor, setContextAnchor] = React.useState<ContextAnchor>(initialContextAnchor);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [size, setSize] = useState({ ...initialSize });
  const [isFileDragging, setIsFileDragging] = useState(false);
  const classes = useStyles();

  const setValue = useCallback((nextValue: InputPicture) => {
    dispatch(actions.setInputPicture(nextValue));
  }, [dispatch]);

  const handleChangeUrl = useCallback(async ({
    url,
    file,
    buffer,
    isExternal,
  }: {
    url?: string,
    file?: File,
    buffer?: Uint8Array,
    isExternal?: boolean,
  }) => {
    if (!url) {
      setImgUrl(url);
      setSize({ ...initialSize });
      return;
    }
    const nextSize = await getImageSize(url);
    if (!nextSize) {
      return;
    }
    setImgUrl(url);
    setSize(nextSize);
    if (file) {
      setValue((file as any).path);
    } else if (buffer) {
      setValue(buffer as any);
    } else if (isExternal) {
      setValue(url);
    } else {
      // setValue(undefined);
    }
  }, [setValue]);

  const handleDragEnter = useCallback(() => {
    setIsFileDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsFileDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsFileDragging(true);
  }, []);

  const handleDrop = useCallback((e) => {
    setIsFileDragging(false);
    let url: string | undefined = e.dataTransfer.getData('url');
    if (e.dataTransfer.files?.length) {
      const [file] = e.dataTransfer.files;
      (async () => {
        url = await readFileSync(file);
        if (url) {
          handleChangeUrl({ url, file });
        }
      })();
    } else if (url) {
      handleChangeUrl({ url, isExternal: true });
    }
  }, [handleChangeUrl]);

  const handleChangeFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    e.preventDefault();
    const [file] = e.target.files || [];
    if (!file) {
      return;
    }

    const url = await readFileSync(file);
    if (url) {
      handleChangeUrl({ url, file });
    }
    e.target.value = '';
    e.target.files = null;
  }, [handleChangeUrl]);

  const handlePictureRightClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setContextAnchor({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };

  const handleClose = useCallback(() => {
    setContextAnchor({ ...initialContextAnchor });
  }, []);

  const handleSearchMusic = useCallback(() => {
    if (!releaseTitle) {
      dispatch(layoutActions.makeAlert({
        type: AlertType.error,
        message: 'Please enter artist and album fields',
      }));
      return;
    }
    window.bridge.ipc.send(getType(actions.searchMusic.request), releaseTitle);
    handleClose();
  }, [releaseTitle, handleClose, dispatch]);

  const handleDelete = useCallback(() => {
    setValue('');
    handleChangeUrl({ url: '' });
    handleClose();
  }, [handleClose, setValue, handleChangeUrl]);

  const handleCopy = useCallback(() => {
    if (imgUrl) {
      window.bridge.copyImage(imgUrl);
    }
    handleClose();
  }, [handleClose, imgUrl]);

  const handlePaste = useCallback(async () => {
    const buffer = window.bridge.pasteImage();
    if (buffer?.length) {
      const blob = new Blob([buffer], { type: 'image/png' });
      const url = await readFileSync(blob);
      handleChangeUrl({ url, buffer });
    }
    handleClose();
  }, [handleClose, handleChangeUrl]);

  useEffect(() => {
    if (!((value as any) instanceof Uint8Array)) {
      handleChangeUrl({ url: value, isExternal: `${value}`.startsWith('http') });
    }
  }, [value, handleChangeUrl]);

  useEffect(() => {
    dispatch(actions.updateInput());
  }, [dispatch]);

  return (
    <>
      <div
        className={classes.wrap}
      >
        <label
          htmlFor='file'
          className={classes.label}
          style={imgUrl ? { backgroundImage: `url('${imgUrl}')` } : undefined}
          onDragEnter={handleDragEnter}
          onContextMenu={handlePictureRightClick}
        >
          <input
            type='file'
            id='file'
            hidden
            accept='image/jpeg, image/png'
            onChange={handleChangeFile}
          />
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={clsx(
              classes.drag,
              isFileDragging && classes.dragging,
            )}
          />
        </label>
        <div className={classes.size}>
          {imgUrl === undefined && '(유지)'}
          {imgUrl && `${size.width}x${size.height}`}
        </div>
      </div>
      <Menu
        keepMounted
        open={contextAnchor.mouseY !== null}
        onClose={handleClose}
        anchorReference='anchorPosition'
        anchorPosition={
          contextAnchor.mouseY !== null && contextAnchor.mouseX !== null
            ? { top: contextAnchor.mouseY, left: contextAnchor.mouseX }
            : undefined
        }
      >
        {!!imgUrl && <MenuItem onClick={handleCopy}>복사</MenuItem>}
        <MenuItem onClick={handlePaste}>붙여넣기</MenuItem>
        {!!imgUrl && (
          <MenuItem
            component='a'
            href={imgUrl}
            onClick={handleClose}
            download
          >
            다운로드
          </MenuItem>
        )}
        {!!imgUrl && (
          <MenuItem onClick={handleDelete}>제거</MenuItem>
        )}
        <MenuItem onClick={handleSearchMusic}>검색</MenuItem>
      </Menu>
    </>
  );
};

export default ImageInput;
