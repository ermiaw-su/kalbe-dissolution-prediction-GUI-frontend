import styles from "./Button.module.css";

type Props = {
  label: string;
};

export default function Button({ label }: Props) {
  return <button className={styles.button}>{label}</button>;
}