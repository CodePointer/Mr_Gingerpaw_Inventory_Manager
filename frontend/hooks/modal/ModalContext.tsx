import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ItemFormModal } from '@/components/items/ItemFormModal';
import { ItemFilterModal } from '@/components/items/itemFilterModal';
import { TagEditModal } from '@/components/tags/TagEditModal';
import { AIDraftFormModal } from '@/components/home/AIDraftFormModal';
import { UserInfoModal } from '@/components/me/UserInfoModal';
import { FamilyInfoEditModal } from '@/components/me/family/FamilyInfoEditModal';
import { LanguageSwitchModal } from '@/components/me/setting/LanguageSwitchModal';
import { FamilyInvitationModal } from '@/components/me/setting/FamilyInvitationModal';
import { ChangeSecurityModal } from '@/components/me/setting/ChangeSecurityModal';


const modalComponents = {
  ItemForm: ItemFormModal,
  ItemFilter: ItemFilterModal,
  TagEdit: TagEditModal,
  AIDraftForm: AIDraftFormModal,
  UserInfo: UserInfoModal,
  FamilyInfoEdit: FamilyInfoEditModal,
  LanguageSwitch: LanguageSwitchModal,
  FamilyInvitation: FamilyInvitationModal,
  ChangeSecurity: ChangeSecurityModal,
} as const;

type ModalComponentMap = typeof modalComponents;
export type ModalKey = keyof ModalComponentMap;

type ModalComponentPropsMap = {
  [K in ModalKey]: React.ComponentProps<ModalComponentMap[K]>;
};

type ItemFormComponentProps = ModalComponentPropsMap['ItemForm'];
type ItemFilterComponentProps = ModalComponentPropsMap['ItemFilter'];
type TagEditComponentProps = ModalComponentPropsMap['TagEdit'];
type AIDraftFormComponentProps = ModalComponentPropsMap['AIDraftForm'];
type FamilyInfoEditComponentProps = ModalComponentPropsMap['FamilyInfoEdit'];

type OpenModalProps<T> = Omit<T, 'visible' | 'onCancel' | 'onSubmit' | 'onClose' | 'onDismiss'>
  & (T extends { onCancel: infer CancelHandler } ? { onCancel?: CancelHandler } : {})
  & (T extends { onClose: infer CloseHandler } ? { onClose?: CloseHandler } : {})
  & (T extends { onDismiss: infer DismissHandler } ? { onDismiss?: DismissHandler } : {})
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
  AIDraftForm: (props, close) => {
    const handleClose = () => {
      try {
        props.onClose?.();
      } finally {
        close();
      }
    };

    const handleSubmit: AIDraftFormComponentProps['onSubmit'] = async (...args: Parameters<AIDraftFormComponentProps['onSubmit']>) => {
      try {
        await Promise.resolve(props.onSubmit?.(...args));
      } finally {
        close();
      }
    };

    return (
      <AIDraftFormModal
        {...props}
        visible={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );
  },
  UserInfo: (props, close) => {
    const handleDismiss = () => {
      try {
        props.onDismiss?.();
      } finally {
        close();
      }
    };

    return (
      <UserInfoModal
        user={props.user}
        onSave={props.onSave}
        visible={true}
        onDismiss={handleDismiss}
      />
    );
  },
  FamilyInfoEdit: (props, close) => {
    const handleDismiss = () => {
      try {
        props.onDismiss?.();
      } finally {
        close();
      }
    };

    const handleDone: FamilyInfoEditComponentProps['onDone'] = async (...args: Parameters<FamilyInfoEditComponentProps['onDone']>) => {
      try {
        await Promise.resolve(props.onDone(...args));
      } finally {
        close();
      }
    };

    return (
      <FamilyInfoEditModal
        {...props}
        visible={true}
        onDismiss={handleDismiss}
        onDone={handleDone}
      />
    );
  },
  LanguageSwitch: (props, close) => {
    const handleDismiss = () => {
      try {
        props.onDismiss?.();
      } finally {
        close();
      }
    };

    return (
      <LanguageSwitchModal
        {...props}
        visible={true}
        onDismiss={handleDismiss}
      />
    );
  },
  FamilyInvitation: (props, close) => {
    const handleDismiss = () => {
      try {
        props.onDismiss?.();
      } finally {
        close();
      }
    };

    return (
      <FamilyInvitationModal
        {...props}
        visible={true}
        onDismiss={handleDismiss}
      />
    );
  },
  ChangeSecurity: (props, close) => {
    const handleDismiss = () => {
      try {
        props.onDismiss?.();
      } finally {
        close();
      }
    };

    return (
      <ChangeSecurityModal
        {...props}
        visible={true}
        onDismiss={handleDismiss}
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
