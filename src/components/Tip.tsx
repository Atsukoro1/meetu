import { Flex, Kbd, Text } from "@mantine/core";

interface TipProps {
    actionText: string;
    keys: string[];
}

const Tip = ({ actionText, keys }: TipProps) => {
    return (
        <Flex>
            <Text>Press&nbsp;</Text>

            <Flex>
                {keys.map((el: string, index: number, _arr: string[]) => {
                    if(index % 2 == 1) {
                        return <Text>+</Text>
                    } else {
                        return <Kbd>{el}</Kbd>
                    }
                })}
            </Flex>

            <Text>&nbsp;{actionText}</Text>
        </Flex>
    )
};

export default Tip;