import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ItemFormModal } from '@/components/items/ItemFormModal';
import { ItemFilterModal } from '@/components/items/itemFilterModal';
import { TagEditModal } from '@/components/tags/TagEditModal';


const modalComponents = {
  ItemForm: ItemFormModal,
  ItemFilter: ItemFilterModal,
  TagEdit: TagEditModal,
} as const;

type ModalComponentMap = typeof modalComponents;
export type ModalKey = keyof ModalComponentMap;

type ModalComponentPropsMap = {
  [K in ModalKey]: React.ComponentProps<ModalComponentMap[K]>;
};

type ItemFormComponentProps = ModalComponentPropsMap['ItemForm'];
type ItemFilterComponentProps = ModalComponentPropsMap['ItemFilter'];
type TagEditComponentProps = ModalComponentPropsMap['TagEdit'];

type OpenModalProps<T> = Omit<T, 'visible' | 'onCancel' | 'onSubmit'>
  & (T extends { onCancel: infer CancelHandler } ? { onCancel?: CancelHandler } : {})
  & (T extends { onSubmit: infer SubmitHandler } ? { onSubmit?: SubmitHandler } : {});

export type ModalPropsMap = {
  [K in ModalKey]: OpenModalProps<ModalComponentPropsMap[K]>;
};

type ActiveModalState = {
  key: ModalKey;
  props: ModalPropsMap[ModalKey];
} | null;

export interface ModalContextType {
  open: <K extends ModalKey>(key: K, props: ModalPropsMap[K]) => void;
  close: () => void;
  isOpen: (key?: ModalKey) => boolean;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

const modalRenderers: {
  [K in ModalKey]: (props: ModalPropsMap[K], close: () => void) => React.ReactElement;
} = {
  ItemForm: (props, close) => {
    const handleCancel = () => {
      try {
        props.onCancel?.();
      } finally {
        close();
      }
    };

    const handleSubmit: ItemFormComponentProps['onSubmit'] = async (...args: Parameters<ItemFormComponentProps['onSubmit']>) => {
      try {
        await Promise.resolve(props.onSubmit?.(...args));
      } finally {
        close();
      }
    };

    return (
      <ItemFormModal
        {...props}
        visible={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    );
  },
  ItemFilter: (props, close) => {
    const handleCancel = () => {
      try {
        props.onCancel?.();
      } finally {
        close();
      }
    };

    const handleSubmit: ItemFilterComponentProps['onSubmit'] = async (...args: Parameters<ItemFilterComponentProps['onSubmit']>) => {
      try {
        await Promise.resolve(props.onSubmit?.(...args));
      } finally {
        close();
      }
    };

    return (
      <ItemFilterModal
        {...props}
        visible={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    );
  },
  TagEdit: (props, close) => {
    const handleCancel = () => {
      try {
        props.onCancel?.();
      } finally {
        close();
      }
    };

    const handleSubmit: TagEditComponentProps['onSubmit'] = async (...args: Parameters<TagEditComponentProps['onSubmit']>) => {
      try {
        await Promise.resolve(props.onSubmit?.(...args));
      } finally {
        close();
      }
    };

    return (
      <TagEditModal
        {...props}
        visible={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    );
  },
};

function renderActiveModal(activeModal: NonNullable<ActiveModalState>, close: () => void): React.ReactElement {
  const renderer = modalRenderers[activeModal.key] as (props: typeof activeModal.props, close: () => void) => React.ReactElement;
  return renderer(activeModal.props, close);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModalState>(null);

  const close = useCallback(() => {
    setActiveModal(null);
  }, []);

  const open = useCallback(<K extends ModalKey>(key: K, props: ModalPropsMap[K]) => {
    setActiveModal({ key, props: props as unknown as ModalPropsMap[ModalKey] });
  }, []);

  const isOpen = useCallback((key?: ModalKey) => {
    if (!activeModal) return false;
    if (!key) return true;
    return activeModal.key === key;
  }, [activeModal]);

  const contextValue = useMemo<ModalContextType>(() => ({
    open,
    close,
    isOpen,
  }), [open, close, isOpen]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {activeModal ? renderActiveModal(activeModal, close) : null}
    </ModalContext.Provider>
  );
}
