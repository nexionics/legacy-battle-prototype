import type { ContactUsScreenProps } from '@/shared/types';
import { useContactUsScreen } from '../../hooks/useContactUsScreen';
import { ContactUsScreen } from './ContactUsScreen';

export default function ContactUsScreenContainer(props: ContactUsScreenProps) {
  const vm = useContactUsScreen();
  return <ContactUsScreen {...props} {...vm} />;
}
