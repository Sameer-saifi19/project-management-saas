import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  memberId: string;
  currentRole: "owner" | "admin" | "member";
};

export default function RoleSwitcher({ currentRole, memberId }: Props) {

    
    
  return (
    <Select defaultValue={currentRole}>
      <SelectTrigger className="w-full max-w-37.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
}
